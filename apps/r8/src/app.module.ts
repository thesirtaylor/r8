import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RateEntitiesModule } from './rate_entities/rate_entities.module';
import { RatingsModule } from './ratings/ratings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from 'data-source';
import { LoggerModule, MessagingModule, RedisModule } from '@app/commonlib';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    RateEntitiesModule,
    RatingsModule,
    RedisModule,
    MessagingModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
