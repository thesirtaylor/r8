import { Controller, Get, Query } from '@nestjs/common';
import { SearchengineService } from './searchengine.service';
import { SearchEngineSearchRateEntityDto } from '@app/commonlib';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RateEntityListResponseDto } from '../openAPI/regularSearch.dto';

@Controller('searchengine')
export class SearchengineController {
  constructor(private readonly searchengineService: SearchengineService) {}

  @Get('search')
  @ApiOperation({
    summary: 'Search Rate Entity, this include autocomplete and ElasticSearch',
  })
  @ApiResponse({
    status: 200,
    description: 'Entity Found',
    type: RateEntityListResponseDto,
  })
  async Search(@Query() dto: SearchEngineSearchRateEntityDto) {
    return this.searchengineService.search(dto);
  }
}
