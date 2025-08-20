// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('JWT_SECRET', 'dev-secret'),
    };
    const iss = cfg.get<string>('JWT_ISSUER')?.trim();
    const aud = cfg.get<string>('JWT_AUDIENCE')?.trim();
    if (iss) (opts as any).issuer = iss;
    if (aud) (opts as any).audience = aud;
    super(opts);
  }

  async validate(payload: JwtPayload) {
    return payload; // se coloca en req.user
  }
}
