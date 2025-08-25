// import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { ValidationRequest } from '@app/commonlib/protos_output/auth.pb';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly service: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }
  async validate(payload: ValidationRequest) {
    return await this.service.validation(payload);
  }
}
