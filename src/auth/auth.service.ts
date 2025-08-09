// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

// Si vas a emitir JWT, descomenta estas líneas y agrega JwtModule en tu AuthModule
// import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    // private readonly jwt: JwtService, // ← descomenta si usas JWT
  ) {}

  async login(dto: LoginDto) {
    const email = dto.email?.trim();
    const password = dto.password ?? '';

    if (!email || !password) {
      throw new BadRequestException('Email y password son requeridos');
    }

    // 1) Buscar usuario por email (normalizado a lower)
    const rows = await this.dataSource.query(
      `
      SELECT
        c.cliente_id,
        c.email,
        c.password_hash,
        r.nombre AS rol,
        cl.nombres,
        cl.apellidos,
        cl.telefono,
        cl.created_at
      FROM credenciales c
      JOIN roles r     ON r.id = c.role_id
      JOIN clientes cl ON cl.id = c.cliente_id
      WHERE lower(c.email) = lower($1)
      LIMIT 1
      `,
      [email],
    );

    const u = rows?.[0];
    if (!u) {
      // Email no encontrado
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2) Validar password en Node (siempre confiable)
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3) (Opcional) Generar JWT con el rol
    // const token = this.jwt.sign({
    //   sub: u.cliente_id,
    //   email: u.email,
    //   rol: u.rol, // 'CLIENTE' | 'EMPRESA' | 'ADMIN'
    // });

    // 4) Respuesta
    return {
      auth_ok: true,
      rol: u.rol,
      cliente: {
        id: u.cliente_id,
        nombres: u.nombres,
        apellidos: u.apellidos,
        telefono: u.telefono,
        email: u.email,
        created_at: u.created_at,
      },
      // token,
      next:
        u.rol === 'ADMIN'
          ? '/admin'
          : u.rol === 'EMPRESA'
            ? '/empresa'
            : '/cliente',
    };
  }
}
