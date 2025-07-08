import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppLoggerService, LoggingInterceptor } from '@app/commonlib';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });
  const logger = app.get(AppLoggerService);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  await app.startAllMicroservices();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.startAllMicroservices();
  await app.listen(process.env.PORT_SEARCH);
}
bootstrap();
