import { Module } from '@nestjs/common';
import { LoggerModule, HealthModule, dataSourceOptions } from '@app/commonlib';
import { SearchengineModule } from './searchengine/searchengine.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    LoggerModule,
    SearchengineModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
