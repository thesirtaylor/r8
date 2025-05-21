import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RateEntitiesModule } from './rate_entities/rate_entities.module';
import { RatingsModule } from './ratings/ratings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'data-source';
import { LoggerModule, RedisModule, RedisService } from '@app/commonlib';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    RateEntitiesModule,
    RatingsModule,
    RedisModule,
  ],
  controllers: [],
  providers: [RedisService],
})
export class AppModule {}
