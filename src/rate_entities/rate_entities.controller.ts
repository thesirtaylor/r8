import { Controller } from '@nestjs/common';
import { RateEntitiesService } from './rate_entities.service';

@Controller('rate-entities')
export class RateEntitiesController {
  constructor(private readonly rateEntitiesService: RateEntitiesService) {}
}
