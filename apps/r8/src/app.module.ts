import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RateEntitiesModule } from './rate_entities/rate_entities.module';
import { RatingsModule } from './ratings/ratings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LoggerModule,
  MessagingModule,
  RedisModule,
  AppDataSource,
} from '@app/commonlib';
import { AppController } from './app.controller';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    RateEntitiesModule,
    RatingsModule,
    RedisModule,
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
