import { TheEntitiesService } from './the_entities.service';
import {
  CreateTheEntityRequest,
  R8_SERVICE_NAME,
  TheEntityListResponse,
  TheEntityResponse,
  SearchTheEntityRequest,
} from '@app/commonlib/protos_output/r8.pb';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('rate-entities')
export class TheEntitiesController {
  constructor(private readonly theEntitiesService: TheEntitiesService) {}

  @GrpcMethod(R8_SERVICE_NAME, 'searchTheEntities')
  async searchTheEntities(
    payload: SearchTheEntityRequest,
  ): Promise<TheEntityListResponse | Observable<TheEntityListResponse>> {
    return this.theEntitiesService.search(payload);
  }

  @GrpcMethod(R8_SERVICE_NAME, 'createTheEntity')
  async createTheEntity(
    payload: CreateTheEntityRequest,
  ): Promise<TheEntityResponse | Observable<TheEntityResponse>> {
    return this.theEntitiesService.create(payload);
  }
}
