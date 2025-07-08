import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import {
  AppDataSource,
  AppLoggerService,
  LoggingInterceptor,
} from '@app/commonlib';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  const app = await NestFactory.create(GatewayModule);
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

  await app.listen(process.env.PORT_GATEWAY);
}
bootstrap();
