import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RateEntitiesService } from './rate_entities.service';
import { CreateRateEntityDto, RateEntity } from '@app/commonlib';
import { SearchRateEntityDto } from '@app/commonlib';

@Controller('rate-entities')
export class RateEntitiesController {
  constructor(private readonly rateEntitiesService: RateEntitiesService) {}

  @Get('search')
  async search(@Query() dto: SearchRateEntityDto): Promise<RateEntity[]> {
    return this.rateEntitiesService.search(dto);
  }

  @Post('entity')
  async createEntity(@Body() payload: CreateRateEntityDto) {
    // return this.rateEntitiesService.
    return payload;
  }

  @Post('faker')
  async fakeEntity() {
    return this.rateEntitiesService.fakerGenerate();
  }
}
