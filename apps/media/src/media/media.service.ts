import {
  AppLoggerService,
  RedisService,
  MediaBatch,
  MediaBatchStatus,
  Media,
  MediaStatus,
  MediaOutbox,
  TheEntity,
} from '@app/commonlib';
import {
  FinaliseUploadRequest,
  UploadMediaRequest,
} from '@app/commonlib/protos_output/media.pb';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { createHash } from 'crypto';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { DataSource, DeepPartial, QueryFailedError } from 'typeorm';

// abstract class CloudflareImages {
//   verify: any;
//   createUploadUrl: any;
// }

// abstract class CloudflareStream {
//   verify: any;
//   createUploadUrl: any;
// }

@Injectable()
export class MediaService {
  constructor(
    private readonly cache: RedisService,
    private readonly logger: AppLoggerService,
    private ds: DataSource,
    // private cloudflare: CloudflareImages,
    // private stream: CloudflareStream,
  ) {}

  private isPGError = (
    e: any,
  ): e is QueryFailedError & { code?: string; detail?: string } =>
    e instanceof QueryFailedError;

  private asRpc(step: string, err: any, extra?: Record<string, any>) {
    const payload: any = {
      step,
      message: err?.message ?? String(err),
      code: this.isPGError(err) ? err.code : err?.code,
      ...extra,
    };
    return new RpcException(payload);
  }

  private async withContext<T>(
    step: string,
    fn: () => Promise<T>,
    extra?: Record<string, any>,
  ) {
    try {
      return await fn();
    } catch (error) {
      throw this.asRpc(step, error, extra);
    }
  }

  async InitiateUpload(payload: UploadMediaRequest) {
    if (!payload.items?.length)
      throw new RpcException('items required for upload');

    const idempotencyKey = this.makeIdempotencyKey(payload);
    const { entityId } = payload;

    const now = new Date();
    const urlTTLSec = 900;
    const urlTTL = new Date(now.getTime() + urlTTLSec * 1000); //let cloudflare determine this

    const ctx = { idempotencyKey, entityId };

    return await this.ds.transaction('SERIALIZABLE', async (manager) => {
      try {
        await this.withContext(
          'insert MediaBatch',
          async () => {
            await manager
              .createQueryBuilder()
              .insert()
              .into(MediaBatch)
              .values({
                entityId,
                idempotencyKey,
                status: MediaBatchStatus.PENDING,
              })
              .orIgnore()
              .execute();
          },
          ctx,
        );

        const batch = await this.withContext(
          'select MediaBatch (for update)',
          async () => {
            return await manager
              .getRepository(MediaBatch)
              .createQueryBuilder('batch')
              .where(
                'batch.idempotencyKey = :idempotencyKey AND batch.entityId = :entityId',
                { idempotencyKey, entityId },
              )
              .setLock('pessimistic_write')
              .getOneOrFail();
          },
          ctx,
        );

        const desired = payload.items.map((it) => {
          const itemKey = createHash('sha256')
            .update(`${payload.entityId}:${it.mime}:${it.size}`)
            .digest('hex');
          return { itemKey, ...it };
        });

        const repo = manager.getRepository(Media);

        const existing = await this.withContext(
          'select Media by batchId',
          async () => {
            return await repo.find({ where: { batchId: batch.id } });
          },
          {
            ...ctx,
            batchId: batch.id,
          },
        );
        const byKey = new Map(existing.map((e) => [e.idempotencyKey, e]));

        const upserts: DeepPartial<Media>[] = [];
        const response: Array<{
          idempotencyKey: string;
          url?: string;
          cfId?: string;
          mime?: string;
          status: Media['status'];
          expiresAt?: Date | null;
          reason?: string;
        }> = [];

        for (const des of desired) {
          const failCheck = des.description; //check item validity here
          if (failCheck) {
            this.logger.warn(
              { ...ctx, itemKey: des, reason: failCheck },
              `Item failed validation check`,
            );
            response.push({
              idempotencyKey: des.itemKey,
              status: MediaStatus.REJECTED,
              reason: failCheck,
            });
            continue;
          }

          const previous = byKey.get(des.itemKey); //should this be des.itemKey or des.idempotencyKey?
          const needsNewUrl =
            !previous ||
            !previous.url ||
            previous.status !== MediaStatus.READY ||
            previous.expiresAt < now;

          if (needsNewUrl) {
            const uploadUrl = `${des.size}-${des.mime}`; //we call cloudflare here, right?
            upserts.push({
              id: previous?.id,
              url: uploadUrl,
              cfId: uploadUrl,
              mime: des.mime,
              size: des.size,
              status: MediaStatus.PENDING_UPLOAD,
              idempotencyKey: des.itemKey,
              batchId: batch.id,
              batch: { id: batch.id },
              entityId,
              entity: { id: payload.entityId },
              expiresAt: urlTTL,
            });

            response.push({
              idempotencyKey: des.itemKey,
              status: MediaStatus.PENDING_UPLOAD,
              url: uploadUrl,
              expiresAt: urlTTL,
            });
          } else {
            response.push({
              idempotencyKey: previous.idempotencyKey,
              status: previous.status,
              url: previous.url,
            });
          }
        }

        if (upserts.length) {
          await this.withContext(
            'assert entity exists',
            async () => {
              await manager
                .getRepository(TheEntity)
                .findOneOrFail({ where: { id: entityId } });
            },
            ctx,
          );

          await this.withContext(
            'save Media upserts',
            async () => {
              await repo.save(upserts);
            },
            {
              ...ctx,
              upserts: upserts.length,
            },
          );
        }

        this.logger.log(
          {
            ...ctx,
            batchId: batch.id,
            urlTTLSeconds: urlTTLSec,
            createdItems: upserts.length,
            items: response.map((i) => ({
              key: i.idempotencyKey,
              status: i.status,
            })),
          },
          'InitiateUpload success',
        );

        return {
          batchId: batch.id,
          entityId: batch.entityId,
        };
      } catch (error) {
        this.logger.error({ error });
        throw new RpcException({ message: error.message });
      }
    });
  }

  //implement withContext for FinaliseUpload
  async FinaliseUpload(payload: FinaliseUploadRequest) {
    const { batchId, entityId } = payload;
    return await this.ds.transaction('SERIALIZABLE', async (manager) => {
      try {
        const ctx = { batchId, entityId };
        const batch = await this.withContext(
          'get lock on Media batch',
          async () => {
            return await manager
              .getRepository(MediaBatch)
              .createQueryBuilder('batch')
              .where('batch.id = :batchId AND batch.entityId = :entityId', {
                batchId,
                entityId,
              })
              .setLock('pessimistic_write')
              .getOneOrFail();
          },
          ctx,
        );

        if (!batch) {
          throw new RpcException({
            code: GrpcStatus.NOT_FOUND,
            message: 'Batch not found',
          });
        }

        if (batch.status === MediaBatchStatus.COMPLETED) {
          const count = await this.withContext(
            'count completed upload',
            async () => {
              return await manager
                .getRepository(Media)
                .count({ where: { batchId } });
            },
            {
              batchId,
            },
          );

          return { batchId, status: 'completed' as const, readyCount: count };
        }

        if (batch.status !== MediaBatchStatus.PENDING) {
          throw new RpcException({
            code: GrpcStatus.FAILED_PRECONDITION,
            message: 'Batch is not in a valid state for finalisation',
          });
        }

        const items = await this.withContext(
          'get media items with lock on media',
          async () => {
            return await manager
              .getRepository(Media)
              .createQueryBuilder('media')
              .where('media.batchId = :batchId', { batchId })
              .setLock('pessimistic_write')
              .getMany();
          },
          {
            batchId,
          },
        );

        if (items.length === 0) {
          throw new RpcException({
            code: GrpcStatus.NOT_FOUND,
            message: 'No media items found for this batch',
          });
        }

        const illegal = items.filter(
          (x) =>
            x.status !== MediaStatus.PENDING_UPLOAD &&
            x.status !== MediaStatus.FAILED,
        );

        if (illegal.length) {
          throw new RpcException('batch contains non-pending items');
        }

        const failures: Array<{ id: string; reason: string }> = [];
        const verified: Array<{
          id: string;
          cfId: string;
          url: string;
          size?: string;
          mime?: string;
        }> = [];

        for (const item of items) {
          try {
            // const verify = await this.cloudflare.verify({
            //   cfId: item.cfId,
            //   mime: item.mime,
            //   size: item.size,
            //   idempotencyKey: item.idempotencyKey,
            // });
            const verify = {
              idempotencyKey: item.idempotencyKey,
              success: true,
              reason: '',
            };

            if (verify.success) {
              item.status = MediaStatus.READY;
              verified.push({
                id: item.id,
                cfId: item.cfId,
                url: item.url,
                size: item.size,
                mime: item.mime,
              });
            } else {
              item.status = MediaStatus.FAILED;
              failures.push({ id: item.id, reason: verify.reason });
            }
          } catch (error) {
            this.logger.error(
              `Failed to verify media ${item.id}: ${error.message}`,
              error.stack,
            );
            item.status = MediaStatus.FAILED;
            failures.push({ id: item.id, reason: error.message });
          }
        }

        if (failures.length) {
          this.logger.warn(
            `Batch ${batchId} has ${failures.length} failed items`,
          );

          throw new RpcException({
            code: GrpcStatus.INTERNAL,
            message: 'finalize verification failed',
            details: failures,
          });
        }

        if (verified.length) {
          const byId = new Map(verified.map((v) => [v.id, v]));

          const updates = items.map((it) => {
            const v = byId.get(it.id)!;
            return {
              id: it.id,
              status: MediaStatus.READY,
              cfId: v.cfId,
              url: v.url,
            } as Partial<Media>;
          });

          await this.withContext('save media updates', async () => {
            await manager.getRepository(Media).save(updates);
          });
        }

        const outboxIdempotencyKey = `${entityId}:${batchId}:completed`;

        await this.withContext(
          'push data to media outbox',
          async () => {
            await manager.getRepository(MediaOutbox).insert({
              idempotencyKey: outboxIdempotencyKey,
              status: MediaBatchStatus.PENDING,
              eventType: 'media.batch.completed',
              payload: JSON.stringify({
                batchId,
                entityId,
                itemIds: items.map((i) => i.id),
                urls: verified.map((v) => v.url),
                cfIds: verified.map((v) => v.cfId),
                count: items.length,
                at: new Date().toISOString(),
              }),
              batchId,
              attempts: 0,
            });
          },
          {
            items,
            verified,
            batchId,
          },
        );

        await this.withContext(
          'update media batch for completed process',
          async () => {
            await manager
              .getRepository(MediaBatch)
              .update(
                { id: batchId },
                { status: MediaBatchStatus.COMPLETED, processedAt: new Date() },
              );
          },
          { batchId },
        );

        return {
          batchId,
          status: 'completed' as const,
          readyCount: items.length,
        };
      } catch (error) {
        this.logger.error({ error });
        throw new RpcException({ message: error.message });
      }
    });
  }

  private makeIdempotencyKey(dto: UploadMediaRequest): string {
    const hashString = `${dto.entityId}:${JSON.stringify(dto.items.map((i) => ({ mime: i.mime, size: i.size })))}`;
    return createHash('sha256').update(hashString).digest('hex');
  }
}
