import { Controller } from '@nestjs/common';
import { SearchengineService } from './searchengine.service';

@Controller('searchengine')
export class SearchengineController {
  constructor(private readonly searchengineService: SearchengineService) {}
}
