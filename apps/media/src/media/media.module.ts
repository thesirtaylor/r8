import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import {
  Media,
  MediaBatch,
  MediaBatchRepository,
  MediaOutbox,
  MediaOutboxRepository,
  MediaRepository,
  RedisModule,
} from '@app/commonlib';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, MediaOutbox, MediaBatch]),
    RedisModule,
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    MediaOutboxRepository,
    MediaRepository,
    MediaBatchRepository,
  ],
})
export class MediaModule {}
