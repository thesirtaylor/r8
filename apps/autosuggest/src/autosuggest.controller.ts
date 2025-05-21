import { Controller, Get, Query } from '@nestjs/common';
import { AutosuggestService } from './autosuggest.service';
import { SearchRateEntityDto } from '@app/commonlib';

@Controller('auto-suggest')
export class AutosuggestController {
  constructor(private readonly autosuggestService: AutosuggestService) {}

  @Get()
  getHello(): string {
    return this.autosuggestService.getHello();
  }

  @Get('search')
  async Search(@Query() dto: SearchRateEntityDto) {
    return this.autosuggestService.search(dto.q);
  }
}
