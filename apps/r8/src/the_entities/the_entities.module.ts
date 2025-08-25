import { Module } from '@nestjs/common';
import { TheEntitiesService } from './the_entities.service';
import { TheEntitiesController } from './the_entities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TheEntity,
  RedisModule,
  RedisService,
  TheEntityRepository,
} from '@app/commonlib';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { OutboxService } from './outbox/outbox.service';
import { Outbox, OutboxRepository } from '@app/commonlib';
import { BullModule } from '@nestjs/bull';
import { OutboxProcessor } from './outbox/outbox.processor';

// const nodeUrl = process.env.ELASTICSEARCH_NODE;

// if (!nodeUrl) {
//   throw new ConflictException('ELASTICSEARCH_NODE not set');
// }

@Module({
  imports: [
    TypeOrmModule.forFeature([TheEntity, Outbox]),
    // ElasticsearchModule.register({
    //   node: nodeUrl,
    // }),
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
