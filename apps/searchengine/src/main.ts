import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import {
  AppLoggerService,
  LoggingInterceptor,
  protoPath,
} from '@app/commonlib';
// import { ValidationPipe } from '@nestjs/common';
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

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: false,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //   }),
  // );
  await app.startAllMicroservices();
}
bootstrap();
