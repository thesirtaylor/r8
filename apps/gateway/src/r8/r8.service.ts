import { AppLoggerService } from '@app/commonlib';
import {
  CreateRatingRequest,
  CreateTheEntityRequest,
  FindRatingsQuery,
  GetRatingStatRequest,
  GetUserRequest,
  GlobalStatsQueryRequest,
  R8_SERVICE_NAME,
  R8ServiceClient,
  SearchTheEntityRequest,
} from '@app/commonlib/protos_output/r8.pb';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class R8Service implements OnModuleInit {
  private service: R8ServiceClient;

  constructor(
    @Inject(R8_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(R8Service.name);
  }
  onModuleInit(): void {
    this.service = this.client.getService<R8ServiceClient>(R8_SERVICE_NAME);
  }

  async createTheEntity(payload: CreateTheEntityRequest) {
    return await firstValueFrom(this.service.createTheEntity(payload));
  }

  async searchTheEntities(payload: SearchTheEntityRequest) {
    return await firstValueFrom(this.service.searchTheEntities(payload));
  }

  async findRatingsForEntity(payload: FindRatingsQuery) {
    return await firstValueFrom(this.service.findRatingsForEntity(payload));
  }

  async createRating(payload: CreateRatingRequest) {
    return await firstValueFrom(this.service.createRating(payload));
  }

  async getGlobalRatingStats(payload: GlobalStatsQueryRequest) {
    return await firstValueFrom(this.service.getGlobalRatingStats(payload));
  }

  async getRatingStat(payload: GetRatingStatRequest) {
    return await firstValueFrom(this.service.getRatingStat(payload));
  }

  async getUser(payload: GetUserRequest) {
    return await firstValueFrom(this.service.getUser(payload));
  }
}
