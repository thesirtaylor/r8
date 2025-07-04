import { ConflictException, Module } from '@nestjs/common';
import { SearchengineController } from './searchengine.controller';
import { SearchengineService } from './searchengine.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { AppLoggerService, RedisModule, RedisService } from '@app/commonlib';

const nodeUrl = process.env.ELASTICSEARCH_NODE;

if (!nodeUrl) {
  throw new ConflictException('ELASTICSEARCH_NODE not set');
}

@Module({
  imports: [
    ElasticsearchModule.register({
      node: nodeUrl,
    }),
    RedisModule,
  ],
  controllers: [SearchengineController],
  providers: [SearchengineService, RedisService, AppLoggerService],
})
export class SearchengineModule {}
