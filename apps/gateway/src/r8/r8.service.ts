import { AppLoggerService } from '@app/commonlib';
import {
  CreateRateEntityRequest,
  R8_SERVICE_NAME,
  R8ServiceClient,
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

  async createRateEntity(payload: CreateRateEntityRequest) {
    return await firstValueFrom(this.service.createRateEntity(payload));
  }

  //   async search() {}
}
