import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  MEDIA_PACKAGE_NAME,
  MEDIA_SERVICE_NAME,
} from '@app/commonlib/protos_output/media.pb';
import { protoPath } from '@app/commonlib';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: MEDIA_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.MEDIA_GRPC,
          package: MEDIA_PACKAGE_NAME,
          protoPath: protoPath('media.proto'),
        },
      },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
