// jwt-auth.guard.ts
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info?: any, context?: ExecutionContext) {
    if (err || !user) {
      // Log útil para depurar en consola
      const req = context?.switchToHttp().getRequest();
      const auth = req?.headers?.authorization;
      console.error('[JWT GUARD] auth header:', auth);
      console.error('[JWT GUARD] info:', info);
      // Mensaje específico si viene de passport-jwt
      const msg = info?.message || info?.name || 'Token ausente o inválido';
      throw err || new UnauthorizedException(msg);
    }
    return user;
  }
}
