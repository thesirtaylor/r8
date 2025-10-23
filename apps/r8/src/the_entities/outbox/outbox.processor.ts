import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AppLoggerService,
  Outbox,
  TheEntity,
  OutboxRepository,
  batchSize,
} from '@app/commonlib';
import { firstValueFrom } from 'rxjs';
import { Processor, Process } from '@nestjs/bull';

@Processor('outbox-processor')
@Injectable()
export class OutboxProcessor implements OnModuleInit {
  private BATCH: number;
  constructor(
    private readonly repository: OutboxRepository,
    @Inject('DATA_STREAM') private readonly client: ClientProxy,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Process('process-pending-entities')
  async handleProcessPendingEntities() {
    await this.emitPendingEntities();
  }

  private async emitPendingEntities() {
    try {
      const pending = await this.repository.find({
        where: { status: 'pending' },
      });

      if (!pending.length) return;

      this.BATCH = batchSize(pending.length);
      if (pending.length > 0) {
        for (let index = 0; index < pending.length; index += this.BATCH) {
          const chunk = pending.slice(index, index + this.BATCH);

          const bulkPayload = chunk.map((e) => ({
            ...(JSON.parse(e.payload) as TheEntity),
            eventId: e.id,
          }));

          await firstValueFrom(
            this.client.emit<string, Array<TheEntity & { eventId: string }>>(
              'rate-entity-created',
              bulkPayload,
            ),
          );
        }
      }

      this.logger.log(
        `Dispatched and marked ${pending.length} entities for publishing.`,
      );
    } catch (error) {
      this.logger.error({ error });
    }
  }

  @Process('cleanup-old-outbox')
  async cleanEmitedOutbox() {
    const res = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Outbox)
      .where('status = :status', { status: 'published' })
      .execute();
    this.logger.log(`Deleted ${res.affected} published outbox rows`);
  }
}
