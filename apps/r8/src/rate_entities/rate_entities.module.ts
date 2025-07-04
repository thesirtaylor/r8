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
import { ConfigModule } from '@nestjs/config';
import { OutboxService } from './outbox/outbox.service';
import { Outbox, OutboxRepository } from '@app/commonlib';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([RateEntity, Outbox]),
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE,
    }),
    RedisModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [RateEntitiesController],
  providers: [
    RateEntitiesService,
    RateEntityRepository,
    RedisService,
    OutboxService,
    OutboxRepository,
  ],
})
export class RateEntitiesModule {}
