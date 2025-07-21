import { RateEntitiesService } from './rate_entities.service';
import {
  CreateRateEntityRequest,
  R8_SERVICE_NAME,
  RateEntityListResponse,
  RateEntityResponse,
  SearchRateEntityRequest,
} from '@app/commonlib/protos_output/r8.pb';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('rate-entities')
export class RateEntitiesController {
  constructor(private readonly rateEntitiesService: RateEntitiesService) {}

  @GrpcMethod(R8_SERVICE_NAME, 'searchRateEntities')
  async searchRateEntities(
    payload: SearchRateEntityRequest,
  ): Promise<RateEntityListResponse | Observable<RateEntityListResponse>> {
    return this.rateEntitiesService.search(payload);
  }

  @GrpcMethod(R8_SERVICE_NAME, 'createRateEntity')
  async createRateEntity(
    payload: CreateRateEntityRequest,
  ): Promise<RateEntityResponse | Observable<RateEntityResponse>> {
    return this.rateEntitiesService.create(payload);
  }
}
