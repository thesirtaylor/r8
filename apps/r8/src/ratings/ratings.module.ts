import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating, RatingRepository } from '@app/commonlib';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), AuthModule],
  controllers: [RatingsController],
  providers: [RatingsService, RatingRepository],
})
export class RatingsModule {}
