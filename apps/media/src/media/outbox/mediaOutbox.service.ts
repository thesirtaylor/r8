import { InjectQueue } from '@nestjs/bull';
import { OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';

export class MediaOutboxService implements OnModuleInit {
  constructor(
    @InjectQueue('media-outbox-processor') private mediaOutboxQueue: Queue,
  ) {}
  async onModuleInit() {
    await this.mediaOutboxQueue.add(
      'process-pending-entity-updates',
      {},
      {
        repeat: { cron: '*/5 * * * * *' },
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    await this.mediaOutboxQueue.add(
      'cleanup-old-media-outbox',
      {},
      { repeat: { cron: '0 2 1 * *' } },
    );
  }
}
