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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OutboxService } from './outbox/outbox.service';
import { Outbox } from '@app/commonlib';
import { OutboxRepository } from '../../../../libs/commonlib/src/repository/outbox.repository';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([RateEntity, Outbox]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
      }),
      inject: [ConfigService],
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
