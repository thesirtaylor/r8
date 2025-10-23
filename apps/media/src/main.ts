import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import {
  AppLoggerService,
  LoggingInterceptor,
  protoPath,
} from '@app/commonlib';
import { protobufPackage } from '@app/commonlib/protos_output/media.pb';
import { protobufPackage as HealthProtoBuf } from '@app/commonlib/protos_output/health.pb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.connectMicroservice({
  //   transport: Transport.REDIS,
  //   options: {
  //     host: process.env.REDIS_HOST,
  //     port: process.env.REDIS_PORT,
  //   },
  // });

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: process.env.MEDIA_GRPC,
      package: [protobufPackage, HealthProtoBuf],
      protoPath: [protoPath('media.proto'), protoPath('health.proto')],
    },
  });

  const logger = app.get(AppLoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  await app.startAllMicroservices();
}
bootstrap();
