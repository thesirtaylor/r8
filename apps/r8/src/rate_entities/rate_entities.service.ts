import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RateEntityRepository } from '@app/commonlib';
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
import { ClientProxy } from '@nestjs/microservices';
import { createHash } from 'crypto';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

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

    // const cached = await this.cache.get(cachekey);
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

    // await this.cache.set(cachekey, JSON.stringify(entities), 300);
    await setCompression(this.cache, cachekey, entities, 300);

    return entities;
  }

  async create(dto: CreateRateEntityDto) {
    const idempotencyKey = this.makeIdempotencyKey(dto);
    return this.ds.transaction(async (manager) => {
      try {
        await manager.getRepository(Outbox).insert({
          eventType: 'rate-entity-created',
          payload: JSON.stringify(dto),
          status: 'pending',
          idempotencyKey,
        });
      } catch (error) {
        if (error.code === '23505') {
          throw new ConflictException('Duplicate operation');
        }
        throw error;
      }
      const entitydto = plainToInstance(CreateRateEntityDto, dto);
      await validateOrReject(entitydto);
      const createEntity = manager.getRepository(RateEntity).create(entitydto);
      return await manager.getRepository(RateEntity).save(createEntity);
    });
  }

  private makeIdempotencyKey(dto: CreateRateEntityDto): string {
    return createHash('sha256').update(JSON.stringify(dto)).digest('hex');
  }
}
