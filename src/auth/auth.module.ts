// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([]), // si tu service usa repositorios, agrégalos aquí
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // si lo usarás en otros módulos
})
export class AuthModule {}
