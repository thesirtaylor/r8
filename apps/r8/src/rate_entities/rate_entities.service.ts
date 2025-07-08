import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ParseCatchResponse,
  RateEntityRepository,
  toSocialLinks,
} from '@app/commonlib';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  CreateRateEntityDto,
  RateEntity,
  RedisService,
  SearchRateEntityDto,
  AppLoggerService,
  Outbox,
  getCompression,
  setCompression,
} from '@app/commonlib';
import { ILike, In } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { createHash } from 'crypto';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateRateEntityRequest } from '@app/commonlib/protos_output/r8.pb';
import { status as gRPCstatus } from '@grpc/grpc-js';

@Injectable()
export class RateEntitiesService {
  private readonly group = 'rate-entity-group';
  private readonly stream = 'rate-entity-created';
  constructor(
    private readonly repository: RateEntityRepository,
    private readonly esService: ElasticsearchService,
    private readonly cache: RedisService,
    private readonly logger: AppLoggerService,
    private ds: DataSource,
    @Inject('DATA_STREAM') private readonly client: ClientProxy,
  ) {}

  async search(dto: SearchRateEntityDto): Promise<RateEntity[]> {
    const { q, type } = dto;

    if (!q) throw new BadRequestException('`q` (query) must be provided');

    const cachekey = `entities:search:${type || 'all'}:${q}`;

    const cached = (await getCompression(this.cache, cachekey)) as RateEntity[];

    if (cached) return cached;

    const must: any[] = [
      {
        multi_match: {
          query: q,
          fields: [
            'name^3',
            'street^2',
            'city',
            'state',
            'country',
            'socials.*',
          ],
          fuzziness: 'auto',
        },
      },
    ];

    if (type) must.push({ term: { type } });

    const esResp = await this.esService.search<RateEntity>({
      index: 'entities',
      body: { query: { bool: { must } } },
    });

    const ids = esResp.hits.hits.map((h) => h._source.id);
    let entities: RateEntity[];

    if (ids.length) {
      entities = await this.repository.find({ where: { id: In(ids) } });

      const orderMap = ids.reduce(
        (m, id, i) => ((m[id] = i), m),
        {} as Record<string, number>,
      );
      entities.sort((a, b) => orderMap[a.id] - orderMap[b.id]);
    } else {
      const where: any = { name: ILike(`%${q}%`) };
      if (type) where.type = type;
      entities = await this.repository.find({ where, take: 10 });
    }

    await setCompression(this.cache, cachekey, entities, 300);

    return entities;
  }

  async create(dto: CreateRateEntityRequest) {
    try {
      const idempotencyKey = this.makeIdempotencyKey(dto);
      const saved = await this.ds.transaction(async (manager) => {
        try {
          await manager.getRepository(Outbox).insert({
            eventType: 'rate-entity-created',
            payload: JSON.stringify(dto),
            status: 'pending',
            idempotencyKey,
          });
        } catch (error) {
          if (error.code === '23505') {
            throw new RpcException({
              code: gRPCstatus.ALREADY_EXISTS,
              message: 'Duplicate operation',
            });
          }
          throw new RpcException({
            code: gRPCstatus.INTERNAL,
            message: 'Failed to write outbox event',
            details: error.message,
          });
        }
        const entitydto = plainToInstance(CreateRateEntityDto, dto);
        const createEntity = manager
          .getRepository(RateEntity)
          .create(entitydto);
        const saved = await manager
          .getRepository(RateEntity)
          .save(createEntity);
        return saved;
      });
      if (!saved) {
        throw new RpcException({
          code: gRPCstatus.INTERNAL,
          message: 'Entity not saved',
        });
      }
      return {
        id: saved.id,
        name: saved.name,
        type: saved.type,
        street: saved.street,
        city: saved.city,
        state: saved.state,
        country: saved.country,
        googlePlaceId: saved.googlePlaceId,
        socials: toSocialLinks(saved.socials ?? {}),
        latitude: saved.latitude,
        longitude: saved.longitude,
        createdAt: saved.createdAt.toISOString(),
        updatedAt: saved.updatedAt.toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `RateEntitiesService.create failed: ${error?.message}`,
        error?.stack,
      );

      if (error instanceof RpcException) throw error;
      ParseCatchResponse(error.code, error);
    }
  }

  private makeIdempotencyKey(dto: CreateRateEntityRequest): string {
    return createHash('sha256').update(JSON.stringify(dto)).digest('hex');
  }
}
