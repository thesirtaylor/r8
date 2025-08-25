import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
  AppLoggerService,
  LoggingInterceptor,
  protoPath,
} from '@app/commonlib';
import { AppModule } from './app.module';
import { protobufPackage } from '@app/commonlib/protos_output/searchengine.pb';
import { protobufPackage as HealthProtoBuf } from '@app/commonlib/protos_output/health.pb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: process.env.SEARCHENGINE_GRPC,
      package: [protobufPackage, HealthProtoBuf],
      protoPath: [protoPath('searchengine.proto'), protoPath('health.proto')],
    },
  });

  const logger = app.get(AppLoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  await app.startAllMicroservices();
}
bootstrap();
