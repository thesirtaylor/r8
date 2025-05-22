import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OutboxRepository } from './outbox.repository';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { AppLoggerService, Outbox, RateEntity } from '@app/commonlib';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OutboxService implements OnModuleInit {
  constructor(
    private readonly repository: OutboxRepository,
    @Inject('DATA_STREAM') private readonly client: ClientProxy,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Cron('*/5 * * * * *')
  async emitPendingEntities() {
    const pending = await this.repository.find({
      where: { status: 'pending' },
    });

    if (!pending.length) return;

    const bulkPayload = pending.map((e) => JSON.parse(e.payload) as RateEntity);

    await firstValueFrom(
      this.client.emit<string, RateEntity[]>(
        'rate-entity-created',
        bulkPayload,
      ),
    );

    await this.repository
      .createQueryBuilder()
      .update(Outbox)
      .set({ status: 'published', publishedAt: () => 'CURRENT_TIMESTAMP' })
      .whereInIds(pending.map((e) => e.id))
      .execute();

    this.logger.log(
      `Dispatched and marked ${pending.length} events as published.`,
    );
  }
}
