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
import { JwtAuthGuard } from '../auth/guards/jwt.oauth-guard';
import {
  AppLoggerService,
  CreateEntityRatingDto,
  FindEntitysRatingsWithCursorQuery,
} from '@app/commonlib';

import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Controller('ratings')
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
    private readonly logger: AppLoggerService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async CreatRating(@Request() req: any) {
    this.logger.log(req.user);
    return req.user;
  }

  @Get('/entity')
  async getEntityRating(@Query() query: FindEntitysRatingsWithCursorQuery) {
    return await this.ratingsService.GetRatingsOfEntity(query);
  }

  @Post('/entity')
  @UseGuards(JwtAuthGuard)
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
}
