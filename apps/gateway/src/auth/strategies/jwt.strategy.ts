// import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ValidationPayload } from '../interface/auth.interface';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private readonly configService: ConfigService,
    private readonly service: AuthService,
  ) {
    // super({
    //   jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
    //   secretOrKey: configService.get<string>('JWT_SECRET'),
    //   ignoreExpiration: false,
    // });
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }
  async validate(payload: ValidationPayload) {
    return await this.service.validation(payload);
  }
}
