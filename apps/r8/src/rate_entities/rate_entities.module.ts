import { Module } from '@nestjs/common';
import { RateEntitiesService } from './rate_entities.service';
import { RateEntitiesController } from './rate_entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RateEntity,
  RedisModule,
  RedisService,
  RateEntityRepository,
} from '@app/commonlib';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { OutboxService } from './outbox/outbox.service';
import { Outbox, OutboxRepository } from '@app/commonlib';
import { BullModule } from '@nestjs/bull';
import { OutboxProcessor } from './outbox/outbox.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([RateEntity, Outbox]),
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE,
    }),
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
  controllers: [RateEntitiesController],
  providers: [
    RateEntitiesService,
    RateEntityRepository,
    RedisService,
    OutboxService,
    OutboxRepository,
    OutboxProcessor,
  ],
})
export class RateEntitiesModule {}
