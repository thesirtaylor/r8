import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  @Inject(AuthService)
  public readonly service: AuthService;

  async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const isValid = await super.canActivate(ctx);
    if (!isValid) {
      return false;
    }
    const req: Request = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['x-access-token'] as string;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token: string = authorization;
    const response = await this.service.verifyToken(token);
    console.log({ response });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.user = response;

    return true;
  }
}
