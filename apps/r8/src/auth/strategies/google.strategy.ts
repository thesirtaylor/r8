import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  // constructor(readonly configService: ConfigService) {
  //   super({
  //     clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
  //     clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
  //     callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
  //     scope: ['email', 'profile'],
  //   });
  // }
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  private async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, photos, provider, displayName } = profile;
    const user = {
      email: emails[0].value,
      avatar: photos[0]?.value,
      provider,
      name: displayName,
    };

    done(null, user);
  }
}
