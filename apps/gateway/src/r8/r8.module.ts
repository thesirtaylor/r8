import { Module } from '@nestjs/common';
import { R8Service } from './r8.service';
import { R8Controller } from './r8.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { protoPath } from '@app/commonlib';
import { AuthModule } from '../auth/auth.module';
import {
  R8_PACKAGE_NAME,
  R8_SERVICE_NAME,
} from '@app/commonlib/protos_output/r8.pb';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: R8_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.R8_GRPC,
          package: R8_PACKAGE_NAME,
          protoPath: protoPath('r8.proto'),
        },
      },
    ]),
  ],
  controllers: [R8Controller],
  providers: [R8Service],
})
export class R8Module {}
