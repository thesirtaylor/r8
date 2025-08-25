import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  AppLoggerService,
  CreateRatingDto,
  CreateTheEntityDto,
  // FindEntitysRatingsWithCursorQuery,
  GlobalStatsQueryDto,
  // RateEntity,
  SearchTheEntityDto,
} from '@app/commonlib';
import {
  ApiBody,
  // ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  GlobalRatingStatsResponseDto,
  PaginatedRatingsResponseDto,
  RateEntityResponseDto,
  RatingDetailResponseDto,
} from '../openAPI';
import { JwtAuthGuard } from '../auth/guards/jwt.oauth-guard';
import { RateEntityListResponseDto } from '../openAPI/regularSearch.dto';
import { R8Service } from './r8.service';
import {
  CreateRatingRequest,
  CreateTheEntityRequest,
  FindRatingsQuery,
  GetRatingStatRequest,
  GlobalStatsQueryRequest,
  SearchTheEntityRequest,
} from '@app/commonlib/protos_output/r8.pb';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@ApiTags('rate-entities')
@Controller('rate-entities')
export class R8Controller {
  constructor(
    private readonly r8Service: R8Service,
    private readonly logger: AppLoggerService,
  ) {}

  @Get('entities')
  @ApiOperation({
    summary:
      'General Search Rate Entity, this does not include autocomplete or ElasticSearch',
  })
  @ApiResponse({
    status: 200,
    description: 'Entity Found',
    type: RateEntityListResponseDto,
  })
  @ApiQuery({
    description: 'Search entity by type & name',
    type: SearchTheEntityDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async search(@Query() dto: SearchTheEntityRequest) {
    return await this.r8Service.searchTheEntities(dto);
  }

  @Post('entities')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Create a new rateable entity' })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: RateEntityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    description: 'Create new rateable entity',
    type: CreateTheEntityDto,
  })
  async CreateEntity(@Body() payload: CreateTheEntityRequest) {
    const dto = plainToInstance(CreateTheEntityDto, payload);
    await validateOrReject(dto);
    return await this.r8Service.createTheEntity(payload);
  }

  @Get('/rates')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Get all ratings for an Entity' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: PaginatedRatingsResponseDto,
  })
  async getEntityRating(@Query() query: FindRatingsQuery) {
    const { entityId, limit, cursorId } = query;
    this.logger.debug({ q: query });
    return await this.r8Service.findRatingsForEntity({
      entityId,
      limit,
      cursorId,
    });
  }

  @Post('/rates')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Rate an Entity' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: RatingDetailResponseDto,
  })
  async rateEntity(@Request() req: any, @Body() payload: CreateRatingRequest) {
    const { user } = req;

    const data = {
      userId: user,
      entity: payload.entityId,
      ...payload,
    };
    this.logger.log({ data });
    const dataDto = plainToInstance(CreateRatingDto, data);
    await validateOrReject(dataDto);
    return await this.r8Service.createRating(data);
  }

  @Get('/global-stats')
  @ApiOperation({ summary: 'Return global statistics for all Entities' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: GlobalRatingStatsResponseDto,
  })
  @ApiQuery({ type: GlobalStatsQueryDto })
  async getGlobalStats(@Query() query: GlobalStatsQueryRequest) {
    this.logger.log({ query });
    const { interval, from, to, cursor, limit, city, state, country, keyword } =
      query;
    const cursor_ = cursor ? cursor : undefined;

    return await this.r8Service.getGlobalRatingStats({
      interval,
      from,
      to,
      cursor: cursor_,
      limit,
      keyword,
      city,
      state,
      country,
    });
  }

  @Get('/stats')
  @ApiOperation({
    summary: 'Return Minimal Statistics for a Particular Entity',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
    // type: GlobalRatingStatsResponseDto,
  })
  // @ApiQuery({ type: GlobalStatsQueryDto })
  async getRatingState(@Query() query: GetRatingStatRequest) {
    const { id } = query;
    return await this.r8Service.getRatingStat({ id });
  }
}
