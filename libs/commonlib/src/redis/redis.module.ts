import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  RedisModule as RedisModuleFromLio,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { Config } from '../configs';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [Config] }),
    RedisModuleFromLio.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const moduleOptions: RedisModuleOptions = {
          readyLog: true,
          errorLog: true,
          closeClient: true,
          config: {
            url: config.get<string>('REDIS'),
          },
        };
        return moduleOptions;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [RedisService],
})
export class RedisModule {}
