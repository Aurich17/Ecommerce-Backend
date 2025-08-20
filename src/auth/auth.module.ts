// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const iss = cfg.get<string>('JWT_ISSUER')?.trim();
        const aud = cfg.get<string>('JWT_AUDIENCE')?.trim();
        const signOptions: any = {
          expiresIn: cfg.get<string>('JWT_EXPIRES_IN', '15m'),
        };
        if (iss) signOptions.issuer = iss;
        if (aud) signOptions.audience = aud;
        return {
          secret: cfg.get<string>('JWT_SECRET', 'dev-secret'),
          signOptions,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
