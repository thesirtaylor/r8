import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../../../gateway/src/auth/guards/jwt.oauth-guard';
import {
  AppLoggerService,
  CreateEntityRatingDto,
  FindEntitysRatingsWithCursorQuery,
  GetRatingStatDto,
  GlobalStatsQueryDto,
} from '@app/commonlib';

import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  GlobalRatingStatsResponseDto,
  PaginatedRatingsResponseDto,
  RatingDetailResponseDto,
} from '../../../gateway/src/openAPI';

@Controller('ratings')
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
    private readonly logger: AppLoggerService,
  ) {}

  @Get('/')
  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  async CreatRating(@Request() req: any) {
    this.logger.log(req.user);
    return req.user;
  }

  @Get('/entity')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Get all ratings for an Entity' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: PaginatedRatingsResponseDto,
  })
  async getEntityRating(@Query() query: FindEntitysRatingsWithCursorQuery) {
    return await this.ratingsService.GetRatingsOfEntity(query);
  }

  @Post('/entity')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Rate an Entity' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: RatingDetailResponseDto,
  })
  async rateEntity(
    @Request() req: any,
    @Body() payload: CreateEntityRatingDto,
  ) {
    const { user } = req;

    const data = {
      userId: user,
      entity: payload.entityId,
      ...payload,
    };
    this.logger.log({ data });
    const dataDto = plainToInstance(CreateEntityRatingDto, data);
    await validateOrReject(dataDto);
    return await this.ratingsService.RateEntity(data);
  }

  @Get('/global-stats')
  @ApiOperation({ summary: 'Return global statistics for all Entities' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: GlobalRatingStatsResponseDto,
  })
  async getGlobalStats(@Query() query: GlobalStatsQueryDto) {
    const { interval, from, to, cursor, limit, city, state, country, keyword } =
      query;

    const locationFilter = { city, state, country };
    const cursor_ = cursor ? cursor : undefined;

    return this.ratingsService.GlobalRatingStat({
      interval,
      from,
      to,
      cursor: cursor_,
      limit,
      keyword,
      locationFilter,
    });
  }

  @Get('/stat')
  @ApiOperation({ summary: 'Return Minimal Statistics a Particular Entity' })
  async getRatingState(@Query() query: GetRatingStatDto) {
    const { id } = query;
    return this.ratingsService.GetRatingStatistic({ id });
  }
}
