import { Module } from '@nestjs/common';
import { SearchengineService } from './searchengine.service';
import { SearchengineController } from './searchengine.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  SEARCH_ENGINE_SERVICE_NAME,
  SEARCHENGINE_PACKAGE_NAME,
} from '@app/commonlib/protos_output/searchengine.pb';
import { protoPath } from '@app/commonlib';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SEARCH_ENGINE_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.SEARCHENGINE_GRPC,
          package: SEARCHENGINE_PACKAGE_NAME,
          protoPath: protoPath('searchengine.proto'),
        },
      },
    ]),
  ],
  controllers: [SearchengineController],
  providers: [SearchengineService],
})
export class SearchengineModule {}
