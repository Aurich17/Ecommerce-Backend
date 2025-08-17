// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

type DbUserRow = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone_e164: string | null;
  status: string; // 'habilitado' | 'deshabilitado' | ...
  social_security_code: string;
  roles: { tab: 'ROL'; cod: string; desc: string }[];
};

@Injectable()
export class AuthService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

  private pickPrimaryRole(
    roles: DbUserRow['roles'],
  ): { cod: string; desc: string } | null {
    if (!roles?.length) return null;
    // prioridad: Admin (999) > Empresa (002) > Cliente (001) > lo que venga
    const byCod = (c: string) => roles.find((r) => r.cod === c);
    return byCod('999') || byCod('002') || byCod('001') || roles[0];
  }

  async login(dto: LoginDto) {
    const email = dto.email?.trim();
    const password = dto.password ?? '';

    if (!email || !password) {
      throw new BadRequestException('Email y password son requeridos');
    }

    // Busca en 'users' + roles desde 'user_roles' (descripciones en e_tipos ROL)
    const rows: DbUserRow[] = await this.ds.query(
      `
      WITH u AS (
        SELECT id, email, password_hash, full_name, phone_e164, status, social_security_code
        FROM users
        WHERE lower(email) = lower($1)
        LIMIT 1
      )
      SELECT
        u.id,
        u.email,
        u.password_hash,
        u.full_name,
        u.phone_e164,
        u.status,
        u.social_security_code,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT('tab','ROL','cod', ur.role_cod, 'desc', t.des_tipo)
          ) FILTER (WHERE ur.user_id IS NOT NULL),
          '[]'
        ) AS roles
      FROM u
      LEFT JOIN user_roles ur
        ON ur.user_id = u.id AND ur.role_tab = 'ROL'
      LEFT JOIN e_tipos t
        ON t.tab_tabla = 'ROL' AND t.cod_tipo = ur.role_cod
      GROUP BY u.id, u.email, u.password_hash, u.full_name, u.phone_e164, u.status, u.social_security_code
      `,
      [email],
    );

    const u = rows?.[0];
    if (!u) {
      // Email no existe
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Valida password con bcrypt (hash generado en DB con pgcrypto también es bcrypt-compatible)
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Valida estado del usuario (si decides bloquear logins deshabilitados)
    if (u.status && u.status.toLowerCase() !== 'habilitado') {
      throw new ForbiddenException(`Usuario ${u.status}`);
    }

    // Rol principal para redirección
    const primary = this.pickPrimaryRole(u.roles);
    const next =
      primary?.cod === '999'
        ? '/admin'
        : primary?.cod === '002'
          ? '/empresa'
          : '/cliente';

    // (Opcional) emitir JWT:
    // const token = this.jwt.sign({ sub: u.id, email: u.email, roles: u.roles.map(r=>r.cod) });

    return {
      auth_ok: true,
      user: {
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        phone_e164: u.phone_e164,
        social_security_code: u.social_security_code,
        status: u.status,
      },
      roles: u.roles, // [{ tab:'ROL', cod:'001', desc:'Cliente' }, ...]
      rol: primary ? primary.desc : null, // compat con tu front anterior
      rol_cod: primary ? primary.cod : null,
      next, // '/admin' | '/empresa' | '/cliente'
      // token,
    };
  }
}
