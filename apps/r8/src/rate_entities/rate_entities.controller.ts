import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RateEntitiesService } from './rate_entities.service';
import { CreateRateEntityDto, RateEntity } from '@app/commonlib';
import { SearchRateEntityDto } from '@app/commonlib';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RateEntityResponseDto } from '../openAPI';
import { JwtAuthGuard } from '../auth/guards/jwt.oauth-guard';
import { RateEntityListResponseDto } from '../openAPI/regularSearch.dto';

@ApiTags('rate-entities')
@Controller('rate-entities')
export class RateEntitiesController {
  constructor(private readonly rateEntitiesService: RateEntitiesService) {}

  @Get('search')
  @ApiOperation({
    summary:
      'General Search Rate Entity, this does not include autocomplete or ElasticSearch',
  })
  @ApiResponse({
    status: 200,
    description: 'Entity Found',
    type: RateEntityListResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async search(@Query() dto: SearchRateEntityDto): Promise<RateEntity[]> {
    return this.rateEntitiesService.search(dto);
  }

  @Post('entity')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('access-token')
  @ApiOperation({ summary: 'Create a new rateable entity' })
  @ApiResponse({
    status: 201,
    description: 'Entity created successfully',
    type: RateEntityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createEntity(@Body() payload: CreateRateEntityDto) {
    return this.rateEntitiesService.create(payload);
  }
}
