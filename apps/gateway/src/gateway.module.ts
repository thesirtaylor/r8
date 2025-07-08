import { Module } from '@nestjs/common';
import { R8Module } from './r8/r8.module';
import { SearchengineModule } from './searchengine/searchengine.module';
import { AppDataSource, LoggerModule } from '@app/commonlib';
import { GatewayController } from './gateway.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/exeptions.filters';

@Module({
  imports: [
    R8Module,
    SearchengineModule,
    LoggerModule,
    AuthModule,
    TypeOrmModule.forRoot(AppDataSource.options),
  ],
  controllers: [GatewayController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [LoggerModule],
})
export class GatewayModule {}
