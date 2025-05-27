import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/guards/jwt.oauth-guard';
import { AppLoggerService } from '@app/commonlib';

@Controller('ratings')
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
    private readonly logger: AppLoggerService,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async CreatRating(@Request() req: any) {
    this.logger.log(req.user);
    return req.user;
  }
}
