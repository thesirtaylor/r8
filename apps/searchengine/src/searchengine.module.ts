import { Module } from '@nestjs/common';
import { SearchengineController } from './searchengine.controller';
import { SearchengineService } from './searchengine.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {
  AppLoggerService,
  LoggerModule,
  RedisModule,
  RedisService,
} from '@app/commonlib';
// import { SearchengineService } from './searchengine/searchengine.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  controllers: [SearchengineController],
  providers: [
    SearchengineService,
    RedisService,
    // SearchengineService,
    AppLoggerService,
  ],
})
export class SearchengineModule {}
