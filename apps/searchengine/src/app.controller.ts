import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health')
  async HealthCheck() {
    return { status: 'ok' };
  }
}
