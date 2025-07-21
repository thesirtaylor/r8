import { Injectable } from '@nestjs/common';
import {
  ParseCatchResponse,
  RateEntityRepository,
  toSocialLinks,
} from '@app/commonlib';
import {
  CreateRateEntityDto,
  RateEntity,
  RedisService,
  AppLoggerService,
  Outbox,
  getCompression,
  setCompression,
} from '@app/commonlib';
import { ILike } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { createHash } from 'crypto';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import {
  CreateRateEntityRequest,
  RateEntityListResponse,
  SearchRateEntityRequest,
} from '@app/commonlib/protos_output/r8.pb';
import { status as gRPCstatus } from '@grpc/grpc-js';

@Injectable()
export class RateEntitiesService {
  private readonly group = 'rate-entity-group';
  private readonly stream = 'rate-entity-created';
  constructor(
    private readonly repository: RateEntityRepository,
    private readonly cache: RedisService,
    private readonly logger: AppLoggerService,
    private ds: DataSource,
  ) {}

  async search(dto: SearchRateEntityRequest): Promise<RateEntityListResponse> {
    const { q, type } = dto;

    if (!q)
      throw new RpcException({
        code: gRPCstatus.INVALID_ARGUMENT,
        message: '`q` (query) must be provided',
      });

    const cachekey = `entities:search:${type || 'all'}:${q}`;

    const cached: RateEntityListResponse = await getCompression(
      this.cache,
      cachekey,
    );

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

    const where: any = { name: ILike(`%${q}%`) };
    if (type) where.type = type;
    const entities = await this.repository.find({ where, take: 10 });
    const data = entities.map((entity) => {
      return this.rate_data(entity);
    });
    const response: RateEntityListResponse = { data };
    await setCompression(this.cache, cachekey, response, 300);
    return response;
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
      return this.rate_data(saved);
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
  private rate_data(data: RateEntity) {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country,
      googlePlaceId: data.googlePlaceId,
      socials: toSocialLinks(data.socials ?? {}),
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };
  }
}
