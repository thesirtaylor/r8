import { NestFactory } from '@nestjs/core';
import { SearchengineModule } from './searchengine.module';
import { Transport } from '@nestjs/microservices';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(SearchengineModule);
  // const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
