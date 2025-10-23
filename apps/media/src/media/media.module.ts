import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './services/media.service';
import {
  Media,
  MediaBatch,
  MediaBatchRepository,
  MediaOutbox,
  MediaOutboxRepository,
  MediaRepository,
  RedisModule,
  RedisService,
} from '@app/commonlib';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaOutboxProcessor } from './outbox/mediaOutbox.process';
import { MediaOutboxService } from './outbox/mediaOutbox.service';
import { BullModule } from '@nestjs/bull';
import { CloudflareServices } from './services/cloudflare.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaOutbox, MediaBatch]),
    RedisModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: 'media-outbox-processor',
    }),
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaOutboxRepository,
    MediaRepository,
    RedisService,
    MediaBatchRepository,
    MediaOutboxProcessor,
    MediaOutboxService,
    CloudflareServices,
  ],
})
export class MediaModule {}
