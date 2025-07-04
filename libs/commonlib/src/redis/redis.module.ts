import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  RedisModule as RedisModuleFromLio,
  // RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    // ConfigModule,
    // RedisModuleFromLio.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (config: ConfigService) => {
    //     const moduleOptions: RedisModuleOptions = {
    //       readyLog: true,
    //       errorLog: true,
    //       closeClient: true,
    //       config: {
    //         url: config.get<string>('REDIS'),
    //       },
    //     };
    //     return moduleOptions;
    //   },
    //   inject: [ConfigService],
    // }),
    RedisModuleFromLio.forRoot({
      readyLog: true,
      errorLog: true,
      closeClient: true,
      config: {
        // host: process.env.REDIS_HOST,
        // port: parseInt(process.env.REDIS_PORT || '6379', 10),
        // or if you’re using `url` instead:
        url: process.env.REDIS,
      },
    }),
  ],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
