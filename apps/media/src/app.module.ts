import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions, HealthModule, LoggerModule } from '@app/commonlib';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    LoggerModule,
    MediaModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
