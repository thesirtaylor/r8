import { Controller, Get, Query } from '@nestjs/common';
import { SearchengineService } from './searchengine.service';
import { SearchRateEntityDto } from '@app/commonlib';

@Controller('searchengine')
export class SearchengineController {
  constructor(private readonly searchengineService: SearchengineService) {}

  @Get('search')
  async Search(@Query() dto: SearchRateEntityDto) {
    return this.searchengineService.search(dto);
  }
}
