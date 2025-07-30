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
  CreateEntityRatingDto,
  CreateRateEntityDto,
  // FindEntitysRatingsWithCursorQuery,
  GlobalStatsQueryDto,
  // RateEntity,
  SearchRateEntityDto,
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
  UserResponseDto,
} from '../openAPI';
import { JwtAuthGuard } from '../auth/guards/jwt.oauth-guard';
import { RateEntityListResponseDto } from '../openAPI/regularSearch.dto';
import { R8Service } from './r8.service';
import {
  CreateEntityRatingRequest,
  CreateRateEntityRequest,
  FindRatingsQuery,
  GetRatingStatRequest,
  GlobalStatsQueryRequest,
  SearchRateEntityRequest,
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
    type: SearchRateEntityDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async search(@Query() dto: SearchRateEntityRequest) {
    return await this.r8Service.searchRateEntities(dto);
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
    type: CreateRateEntityDto,
  })
  async CreateEntity(@Body() payload: CreateRateEntityRequest) {
    const dto = plainToInstance(CreateRateEntityDto, payload);
    await validateOrReject(dto);
    return await this.r8Service.createRateEntity(payload);
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
    return await this.r8Service.findRatingsForEntity(query);
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
  async rateEntity(
    @Request() req: any,
    @Body() payload: CreateEntityRatingRequest,
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
    return await this.r8Service.createEntityRating(data);
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

  @Get('user')
  // @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Fetch User by id' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async GetUser(@Query('id') id: string) {
    return this.r8Service.getUser({ id });
  }
}
