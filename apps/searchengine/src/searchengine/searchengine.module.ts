import { ConflictException, Module } from '@nestjs/common';
import { SearchengineController } from './searchengine.controller';
import { SearchengineService } from './searchengine.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {
  Outbox,
  OutboxRepository,
  TheEntity,
  RedisModule,
  MediaOutboxRepository,
} from '@app/commonlib';
import { TypeOrmModule } from '@nestjs/typeorm';

const nodeUrl = process.env.ELASTICSEARCH_NODE;

if (!nodeUrl) {
  throw new ConflictException('ELASTICSEARCH_NODE not set');
}

@Module({
  imports: [
    TypeOrmModule.forFeature([TheEntity, Outbox]),
    ElasticsearchModule.register({
      node: nodeUrl,
    }),
    RedisModule,
  ],
  controllers: [SearchengineController],
  providers: [SearchengineService, OutboxRepository, MediaOutboxRepository],
})
export class SearchengineModule {}
