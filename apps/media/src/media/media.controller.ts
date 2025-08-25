import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  FinaliseUploadRequest,
  FinaliseUploadResponse,
  MEDIA_SERVICE_NAME,
  UploadMediaRequest,
  UploadMediaResponse,
} from '@app/commonlib/protos_output/media.pb';
import { Observable } from 'rxjs';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @GrpcMethod(MEDIA_SERVICE_NAME, 'initiateUpload')
  async initiateUpload(
    payload: UploadMediaRequest,
  ): Promise<UploadMediaResponse | Observable<UploadMediaResponse>> {
    return await this.mediaService.initiateUpload(payload);
  }

  @GrpcMethod(MEDIA_SERVICE_NAME, 'finaliseUpload')
  async finaliseUpload(
    payload: FinaliseUploadRequest,
  ): Promise<FinaliseUploadResponse | Observable<FinaliseUploadResponse>> {
    return await this.mediaService.finaliseUpload(payload);
  }
}
