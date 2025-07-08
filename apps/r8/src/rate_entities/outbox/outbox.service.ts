import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppLoggerService } from '@app/commonlib';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class OutboxService implements OnModuleInit {
  constructor(
    @InjectQueue('outbox-processor') private outboxQueue: Queue,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit() {
    await this.outboxQueue.add(
      'process-pending-entities',
      {},
      {
        repeat: { cron: '*/5 * * * * *' },
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    await this.outboxQueue.add(
      'cleanup-old-outbox',
      {},
      {
        repeat: { cron: '0 2 1 * *' },
      },
    );
  }
}
