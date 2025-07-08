/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, Get, Req, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppLoggerService } from '@app/commonlib';
import { GoogleOauthGuard } from './guards/google.oauth-guard';
import { ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OAuthCallbackResponseDto } from '../openAPI';

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
  @ApiOperation({ summary: 'Redirect to Google OAuth login' })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google login page',
    headers: {
      Location: {
        description: 'Google OAuth URL',
        schema: {
          type: 'string',
          example: 'https://accounts.google.com/o/oauth2/v2/auth?...',
        },
      },
    },
    type: OAuthCallbackResponseDto,
  })
  async initGoogle() {}

  @Get('google-callback')
  @UseGuards(GoogleOauthGuard)
  @ApiExcludeEndpoint()
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
