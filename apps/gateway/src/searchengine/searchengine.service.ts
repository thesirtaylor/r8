import {
  SEARCH_ENGINE_SERVICE_NAME,
  SearchEngineServiceClient,
  SearchRequest,
} from '@app/commonlib/protos_output/searchengine.pb';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SearchengineService implements OnModuleInit {
  private service: SearchEngineServiceClient;

  constructor(
    @Inject(SEARCH_ENGINE_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.service = this.client.getService<SearchEngineServiceClient>(
      SEARCH_ENGINE_SERVICE_NAME,
    );
  }

  async search(payload: SearchRequest) {
    return await firstValueFrom(this.service.search(payload));
  }
}
