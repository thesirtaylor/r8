import { ConflictException, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RateEntitiesModule } from './rate_entities/rate_entities.module';
import { RatingsModule } from './ratings/ratings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LoggerModule,
  MessagingModule,
  RedisModule,
  AppDataSource,
  HealthModule,
} from '@app/commonlib';

const nodeUrl = process.env.ELASTICSEARCH_NODE;

if (!nodeUrl) {
  throw new ConflictException('ELASTICSEARCH_NODE not set');
}

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    RateEntitiesModule,
    RatingsModule,
    RedisModule,
    MessagingModule,
    HealthModule.register({
      elasticsearchConfig: {
        node: process.env.ELASTICSEARCH_NODE,
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
