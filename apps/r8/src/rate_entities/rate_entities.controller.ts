import { RateEntitiesService } from './rate_entities.service';
import { CreateRateEntityDto, RateEntity } from '@app/commonlib';
import { SearchRateEntityDto } from '@app/commonlib';
import {
  CreateRateEntityRequest,
  R8_SERVICE_NAME,
  RateEntityResponse,
} from '@app/commonlib/protos_output/r8.pb';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('rate-entities')
export class RateEntitiesController {
  constructor(private readonly rateEntitiesService: RateEntitiesService) {}

  // @GrpcMethod()
  // async search(): Promise<RateEntity[]> {
  //   return this.rateEntitiesService.search(dto);
  // }
  @GrpcMethod(R8_SERVICE_NAME, 'createRateEntity')
  async createRateEntity(
    payload: CreateRateEntityRequest,
  ): Promise<RateEntityResponse | Observable<RateEntityResponse>> {
    return this.rateEntitiesService.create(payload);
  }
}
