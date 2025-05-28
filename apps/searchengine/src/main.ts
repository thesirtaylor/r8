import { NestFactory } from '@nestjs/core';
import { SearchengineModule } from './searchengine.module';
import { Transport } from '@nestjs/microservices';
import { AppLoggerService, LoggingInterceptor } from '@app/commonlib';

async function bootstrap() {
  const app = await NestFactory.create(SearchengineModule);

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
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
