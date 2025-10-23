import { Module } from '@nestjs/common';
import { TheEntitiesService } from './the_entities.service';
import { TheEntitiesController } from './the_entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TheEntity,
  RedisModule,
  RedisService,
  TheEntityRepository,
  Outbox,
  OutboxRepository,
} from '@app/commonlib';
import { OutboxService } from './outbox/outbox.service';
import { BullModule } from '@nestjs/bull';
import { OutboxProcessor } from './outbox/outbox.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([TheEntity, Outbox]),
    RedisModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: 'outbox-processor',
    }),
  ],
  controllers: [TheEntitiesController],
  providers: [
    TheEntitiesService,
    TheEntityRepository,
    RedisService,
    OutboxService,
    OutboxRepository,
    OutboxProcessor,
  ],
})
export class TheEntitiesModule {}
