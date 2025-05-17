import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RateEntitiesModule } from './rate_entities/rate_entities.module';
import { RatingsModule } from './ratings/ratings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    RateEntitiesModule,
    RatingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
