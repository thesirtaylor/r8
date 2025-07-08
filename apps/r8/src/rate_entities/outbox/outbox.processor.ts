import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AppLoggerService,
  Outbox,
  RateEntity,
  OutboxRepository,
} from '@app/commonlib';
import { firstValueFrom } from 'rxjs';
import { Processor, Process } from '@nestjs/bull';

@Processor('outbox-processor')
@Injectable()
export class OutboxProcessor implements OnModuleInit {
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

  async emitPendingEntities() {
    try {
      const pending = await this.repository.find({
        where: { status: 'pending' },
      });

      if (!pending.length) {
        return;
      }

      const bulkPayload = pending.map((e) => ({
        eventId: e.id,
        ...(JSON.parse(e.payload) as RateEntity),
      }));

      await firstValueFrom(
        this.client.emit<string, Array<RateEntity & { eventId: string }>>(
          'rate-entity-created',
          bulkPayload,
        ),
      );

      this.logger.log(
        `Dispatched and marked ${pending.length} entities for publishing.`,
      );
    } catch (error) {
      this.logger.error(error);
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
