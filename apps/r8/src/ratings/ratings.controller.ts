import { Controller } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { AppLoggerService } from '@app/commonlib';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateEntityRatingRequest,
  FindRatingsQuery,
  GetRatingStatRequest,
  GetRatingStatResponse,
  GlobalRatingStatsResponse,
  GlobalStatsQueryRequest,
  PaginatedRatingsResponse,
  R8_SERVICE_NAME,
  RatingDetailResponse,
} from '@app/commonlib/protos_output/r8.pb';
import { Observable } from 'rxjs';

@Controller('ratings')
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
    private readonly logger: AppLoggerService,
  ) {}

  @GrpcMethod(R8_SERVICE_NAME, 'findRatingsForEntity')
  async findRatingsForEntity(
    payload: FindRatingsQuery,
  ): Promise<PaginatedRatingsResponse | Observable<PaginatedRatingsResponse>> {
    return await this.ratingsService.GetRatingsOfEntity(payload);
  }

  @GrpcMethod(R8_SERVICE_NAME, 'createEntityRating')
  async createEntityRating(
    payload: CreateEntityRatingRequest,
  ): Promise<RatingDetailResponse | Observable<RatingDetailResponse>> {
    return await this.ratingsService.RateEntity(payload);
  }

  @GrpcMethod(R8_SERVICE_NAME, 'getGlobalRatingStats')
  async getGlobalRatingStats(
    payload: GlobalStatsQueryRequest,
  ): Promise<
    GlobalRatingStatsResponse | Observable<GlobalRatingStatsResponse>
  > {
    return await this.ratingsService.GlobalRatingStat(payload);
  }

  @GrpcMethod(R8_SERVICE_NAME, 'getRatingStat')
  async getRatingStat(
    payload: GetRatingStatRequest,
  ): Promise<GetRatingStatResponse | Observable<GetRatingStatResponse>> {
    return await this.ratingsService.GetRatingStatistic(payload);
  }
}
