import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  dataSourceOptions,
  HealthModule,
  LoggerModule,
  MessagingModule,
} from '@app/commonlib';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    MediaModule,
    HealthModule,
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
