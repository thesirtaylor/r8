import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import {
  AppLoggerService,
  LoggingInterceptor,
  protoPath,
} from '@app/commonlib';
import { protobufPackage } from '@app/commonlib/protos_output/auth.pb';
import { protobufPackage as HealthProtoBuf } from '@app/commonlib/protos_output/health.pb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: process.env.AUTH_GRPC,
      package: [protobufPackage, HealthProtoBuf],
      protoPath: [protoPath('auth.proto'), protoPath('health.proto')],
    },
  });

  const logger = app.get(AppLoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  await app.startAllMicroservices();
}
bootstrap();
