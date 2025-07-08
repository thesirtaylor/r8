import { Module } from '@nestjs/common';
import { SearchengineService } from './searchengine.service';
import { SearchengineController } from './searchengine.controller';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([])],
  controllers: [SearchengineController],
  providers: [SearchengineService],
})
export class SearchengineModule {}
