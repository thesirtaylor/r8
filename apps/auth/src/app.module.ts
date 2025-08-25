import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule, LoggerModule, dataSourceOptions } from '@app/commonlib';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    LoggerModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
