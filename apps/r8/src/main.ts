import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from 'data-source';

async function bootstrap() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
