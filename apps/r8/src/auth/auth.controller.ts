/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Req, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppLoggerService } from '@app/commonlib';
import { GoogleOauthGuard } from './guards/google.oauth-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async initGoogle() {}

  @Get('google-callback')
  @UseGuards(GoogleOauthGuard)
  async google(@Req() req: Request) {
    try {
      //@ts-ignore
      const { user } = req;
      return this.authService.google(user);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
