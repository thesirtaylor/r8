import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { protoPath } from '@app/commonlib';
import { Transport } from '@nestjs/microservices';
import { protobufPackage } from '@app/commonlib/protos_output/r8.pb';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: process.env.R8_GRPC,
      package: protobufPackage,
      protoPath: protoPath('r8.proto'),
    },
  });

  await app.listen();
}
bootstrap();
