import {
  FinaliseUploadRequest,
  MEDIA_SERVICE_NAME,
  MediaServiceClient,
  UploadMediaRequest,
} from '@app/commonlib/protos_output/media.pb';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MediaService implements OnModuleInit {
  private service: MediaServiceClient;

  constructor(
    @Inject(MEDIA_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.service =
      this.client.getService<MediaServiceClient>(MEDIA_SERVICE_NAME);
  }

  async initiateUpload(payload: UploadMediaRequest) {
    return await firstValueFrom(this.service.initiateUpload(payload));
  }

  async finaliseUpload(payload: FinaliseUploadRequest) {
    return await firstValueFrom(this.service.finaliseUpload(payload));
  }
}
