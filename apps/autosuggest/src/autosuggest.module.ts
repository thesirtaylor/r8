import { Module } from '@nestjs/common';
import { AutosuggestController } from './autosuggest.controller';
import { AutosuggestService } from './autosuggest.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {
  AppLoggerService,
  LoggerModule,
  RedisModule,
  RedisService,
} from '@app/commonlib';
import { SearchengineService } from './searchengine/searchengine.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
  ],
  controllers: [AutosuggestController],
  providers: [
    AutosuggestService,
    RedisService,
    SearchengineService,
    AppLoggerService,
  ],
})
export class AutosuggestModule {}
