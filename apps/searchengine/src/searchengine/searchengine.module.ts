import { ConflictException, Module } from '@nestjs/common';
import { SearchengineController } from './searchengine.controller';
import { SearchengineService } from './searchengine.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {
  // AppLoggerService,
  Outbox,
  OutboxRepository,
  RateEntity,
  RedisModule,
  // RedisService,
} from '@app/commonlib';
import { TypeOrmModule } from '@nestjs/typeorm';

const nodeUrl = process.env.ELASTICSEARCH_NODE;

if (!nodeUrl) {
  throw new ConflictException('ELASTICSEARCH_NODE not set');
}

@Module({
  imports: [
    TypeOrmModule.forFeature([RateEntity, Outbox]),
    ElasticsearchModule.register({
      node: nodeUrl,
    }),
    RedisModule,
  ],
  controllers: [SearchengineController],
  providers: [
    SearchengineService,
    // RedisService,
    // AppLoggerService,
    OutboxRepository,
  ],
})
export class SearchengineModule {}
