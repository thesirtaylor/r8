import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from 'data-source';
import { AppLoggerService, LoggingInterceptor } from '@app/commonlib';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  const app = await NestFactory.create(AppModule);
  const logger = app.get(AppLoggerService);

  const apiConfig = new DocumentBuilder()
    .setTitle('Api Gateway')
    .setDescription('Api Gateway for r8')
    .setVersion('0.1.0')
    .addTag('rating')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-access-token',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, apiConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

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

  await app.listen(4002);
}
bootstrap();
