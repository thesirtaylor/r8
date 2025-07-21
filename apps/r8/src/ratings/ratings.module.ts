import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Rating,
  RatingRepository,
  RedisModule,
  RedisService,
} from '@app/commonlib';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), RedisModule],
  controllers: [RatingsController],
  providers: [RatingsService, RatingRepository, RedisService],
})
export class RatingsModule {}
