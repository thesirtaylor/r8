import { Module } from '@nestjs/common';
import { TheEntitiesModule } from './the_entities/the_entities.module';
import { RatingsModule } from './ratings/ratings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LoggerModule,
  MessagingModule,
  RedisModule,
  dataSourceOptions,
} from '@app/commonlib';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    TheEntitiesModule,
    RatingsModule,
    RedisModule,
    MessagingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
