import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AppLoggerService,
  LoggingInterceptor,
  protoPath,
} from '@app/commonlib';
import { Transport } from '@nestjs/microservices';
import { protobufPackage } from '@app/commonlib/protos_output/r8.pb';
import { protobufPackage as HealthProtoBuf } from '@app/commonlib/protos_output/health.pb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: process.env.R8_GRPC,
      package: [protobufPackage, HealthProtoBuf],
      protoPath: [protoPath('r8.proto'), protoPath('health.proto')],
    },
  });

  const logger = app.get(AppLoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  await app.startAllMicroservices();
}
bootstrap();
