import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService as JWT } from '@nestjs/jwt';

@Injectable()
export class JWTService {
  private readonly jwt: JWT;

  constructor(jwt: JWT) {
    this.jwt = jwt;
  }

  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  public async generateToken(
    auth: any,
    options?: { expiresIn?: string },
  ): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.jwt.sign(auth, options));
    });
  }

  public async verify(token: string): Promise<any> {
    try {
      return new Promise((resolve) => {
        resolve(this.jwt.verify(token));
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
