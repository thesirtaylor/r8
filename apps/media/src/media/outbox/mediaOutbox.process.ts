import {
  AppLoggerService,
  batchSize,
  MediaOutbox,
  MediaOutboxRepository,
} from '@app/commonlib';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MediaUpdatePayload } from '@app/commonlib/interfaces';
import { firstValueFrom } from 'rxjs';

@Processor('outbox-media-processor')
@Injectable()
export class MediaOutboxProcessor implements OnModuleInit {
  private BATCH: number;
  constructor(
    private readonly repository: MediaOutboxRepository,
    @Inject('DATA_STREAM') private readonly client: ClientProxy,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Process('process-pending-entity-updates')
  async handleProcessPendingEntityUpdate() {
    this.emitPendingEntities();
  }

  private async emitPendingEntities() {
    try {
      const pending = await this.repository.find({
        where: { status: 'pending', publishedAt: null },
      });

      if (!pending.length) return;

      this.BATCH = batchSize(pending.length);
      if (pending.length > 0) {
        for (let index = 0; index < pending.length; index += this.BATCH) {
          const chunk = pending.slice(index, index + this.BATCH);

          const bulkPayload: MediaUpdatePayload[] = chunk.map((outboxItem) => {
            const payload = JSON.parse(outboxItem.payload);

            return {
              batchId: payload.batchId,
              entityId: payload.entityId,
              itemIds: payload.itemIds,
              urls: payload.urls,
              cfIds: payload.cfIds,
              count: payload.count,
              totalItems: payload.totalItems,
              failedCount: payload.failedCount,
              at: payload.at,
              eventId: outboxItem.id,
            };
          });

          await firstValueFrom(
            this.client.emit<string, MediaUpdatePayload[]>(
              'rate-entity-media-updated',
              bulkPayload,
            ),
          );
        }
      }

      this.logger.log(
        `Dispatched and marked ${pending.length} entities for updating`,
      );
    } catch (error) {
      this.logger.error({ error });
    }
  }

  @Process('cleanup-old-media-outbox')
  async cleanEmittedMediaOutbox() {
    const res = await this.repository
      .createQueryBuilder()
      .delete()
      .from(MediaOutbox)
      .where('status = :status', { status: 'published' })
      .execute();
    this.logger.log(`Deleted ${res.affected} published media outbix rows`);
  }
}
