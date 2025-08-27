import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, RoleItem, MenuNode, JwtPayload } from './auth.types';
import { ConfigService } from '@nestjs/config';

type DbUserRow = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone_e164: string | null;
  status: string | null; // legacy (si aún existe)
  social_security_code: string | null;
  id_rol: number | null;
  rol_descripcion: string | null;
  rol_activo: boolean | null;

  // ⬇️ NUEVO
  account_state_tab: string | null;
  account_state_cod: string | null;
  est_desc: string | null; // descripción de e_tipos
};

type MenuRow = {
  id: number;
  descripcion: string;
  icono: string | null;
  is_submenu: boolean;
  id_padre: number | null;
  url: string | null;
  perm_add: boolean;
  perm_edit: boolean;
  perm_delete: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private readonly ds: DataSource,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  private pickNextRoute(idRol: number | null, rolDesc: string | null): string {
    const d = (rolDesc || '').toLowerCase();
    if (/(admin|super)/.test(d)) return '/admin';
    if (/(empresa|partner|vendor)/.test(d)) return '/empresa';
    return '/cliente';
  }

  private buildMenuTree(rows: MenuRow[]): MenuNode[] {
    const byId = new Map<number, MenuNode>();
    const roots: MenuNode[] = [];

    for (const r of rows) {
      byId.set(r.id, {
        id: r.id,
        label: r.descripcion,
        icon: r.icono,
        isSubmenu: r.is_submenu,
        parentId: r.id_padre,
        url: r.url,
        perms: {
          add: !!r.perm_add,
          edit: !!r.perm_edit,
          delete: !!r.perm_delete,
        },
        children: [],
      });
    }

    for (const node of byId.values()) {
      if (node.parentId != null && byId.has(node.parentId)) {
        byId.get(node.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  private async buildMenuFlat(idRol: number): Promise<MenuRow[]> {
    return this.ds.query(
      `
    WITH RECURSIVE tree (
      id, descripcion, icono, is_submenu, id_padre,
      perm_add, perm_edit, perm_delete, url
    ) AS (
      SELECT
        m.id,
        m.descripcion,
        m.icono,
        COALESCE(m."isSubmenu", false) AS is_submenu,
        NULLIF(m.idpadre, 0)           AS id_padre,
        COALESCE(a.add_register,    false) AS perm_add,
        COALESCE(a.edit_register,   false) AS perm_edit,
        COALESCE(a.delete_register, false) AS perm_delete,
        m.url
      FROM public.menu m
      JOIN public.acceso a
        ON a.id_menu = m.id
       AND a.id_rol  = $1
       AND COALESCE(a.activo, true) = true
      WHERE COALESCE(m.activo, true) = true

      UNION ALL

      SELECT
        c.id,
        c.descripcion,
        c.icono,
        COALESCE(c."isSubmenu", false) AS is_submenu,
        NULLIF(c.idpadre, 0)           AS id_padre,
        COALESCE(ac.add_register,    t.perm_add)    AS perm_add,
        COALESCE(ac.edit_register,   t.perm_edit)   AS perm_edit,
        COALESCE(ac.delete_register, t.perm_delete) AS perm_delete,
        c.url
      FROM public.menu c
      JOIN tree t ON t.id = c.idpadre
      LEFT JOIN public.acceso ac
        ON ac.id_menu = c.id
       AND ac.id_rol  = $1
       AND COALESCE(ac.activo, true) = true
      WHERE COALESCE(c.activo, true) = true
    )
    SELECT
      id, descripcion, icono, is_submenu, id_padre,
      perm_add, perm_edit, perm_delete, url   -- ⬅️ agrega url aquí
    FROM tree
    ORDER BY COALESCE(id_padre, 0), id
    `,
      [idRol],
    );
  }

  private signAccessToken(payload: JwtPayload): {
    token: string;
    expiresIn: number;
  } {
    const expiresInStr = this.cfg.get<string>('JWT_EXPIRES_IN', '15m');
    const unit = expiresInStr.endsWith('m')
      ? 60
      : expiresInStr.endsWith('h')
        ? 3600
        : 1;
    const num = parseInt(expiresInStr, 10);
    const seconds = Number.isFinite(num) ? num * unit : 900;

    const opts: any = {
      expiresIn: expiresInStr,
      secret: this.cfg.get('JWT_SECRET', 'dev-secret'),
    };
    const iss = this.cfg.get<string>('JWT_ISSUER')?.trim();
    const aud = this.cfg.get<string>('JWT_AUDIENCE')?.trim();
    if (iss) opts.issuer = iss;
    if (aud) opts.audience = aud;

    const token = this.jwt.sign(payload, opts);
    return { token, expiresIn: seconds };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const email = dto.email?.trim();
    const password = dto.password ?? '';
    if (!email || !password) {
      throw new BadRequestException('Email y password son requeridos');
    }

    // 1) Usuario + rol + estado de cuenta (JOIN a e_tipos)
    const rows: DbUserRow[] = await this.ds.query(
      `
    SELECT
      u.id,
      u.email,
      u.password_hash,
      u.full_name,
      u.phone_e164,
      u.status,
      u.social_security_code,
      u.id_rol,
      r.descripcion  AS rol_descripcion,
      r.activo       AS rol_activo,
      u.account_state_tab,
      u.account_state_cod,
      t.des_tipo     AS est_desc
    FROM public.users u
    LEFT JOIN public.rol r
      ON r.id = u.id_rol
    LEFT JOIN public.e_tipos t
      ON t.tab_tabla = u.account_state_tab
     AND t.cod_tipo  = u.account_state_cod
    WHERE lower(u.email) = lower($1)
    LIMIT 1
    `,
      [email],
    );

    const u = rows?.[0];
    if (!u) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    // ⛔️ YA NO BLOQUEAMOS POR ESTADO
    // const estTab = u.account_state_tab ?? 'EST';
    // const estCod = u.account_state_cod ?? '001';
    // const estDesc = (u.est_desc ?? '').toUpperCase();
    // if (estTab === 'EST' && estCod !== '002') { ... ForbiddenException ... }

    if (u.rol_activo === false) {
      throw new ForbiddenException('Rol inactivo');
    }

    // 2) Menú
    let menuFlat: MenuRow[] = [];
    const reg = await this.ds.query(
      `SELECT to_regclass('public.acceso') AS acceso, to_regclass('public.menu') AS menu;`,
    );
    const haveAcceso = !!reg?.[0]?.acceso;
    const haveMenu = !!reg?.[0]?.menu;

    if (u.id_rol && haveAcceso && haveMenu) {
      menuFlat = await this.buildMenuFlat(u.id_rol);
    } else {
      console.warn(
        `[auth] Menú omitido: acceso=${haveAcceso} menu=${haveMenu} (id_rol=${u.id_rol})`,
      );
    }
    const menuTree = this.buildMenuTree(menuFlat);

    // 3) Rol (compat front)
    const roleItem: RoleItem | null =
      u.id_rol != null || u.rol_descripcion
        ? {
            tab: 'ROL',
            cod: String(u.id_rol ?? ''),
            desc: u.rol_descripcion ?? '',
          }
        : null;

    // 4) Token
    const payload: JwtPayload = {
      sub: u.id,
      email: u.email,
      rol_cod: roleItem?.cod ?? null,
      rol: roleItem?.desc ?? null,
    };
    const { token, expiresIn } = this.signAccessToken(payload);

    // 5) Ruta sugerida
    const next = this.pickNextRoute(u.id_rol, u.rol_descripcion);

    // 6) Respuesta con accountState (info) pero sin bloquear
    return {
      auth_ok: true,
      user: {
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        phone_e164: u.phone_e164,
        social_security_code: u.social_security_code,
        accountState: {
          tab: u.account_state_tab ?? 'EST',
          cod: u.account_state_cod ?? '001',
          desc: u.est_desc ?? '',
        },
        // 'status' legacy, lo dejamos por compat si lo usas en el front
        status: u.status,
      },
      roles: roleItem ? [roleItem] : [],
      rol: roleItem ? roleItem.desc : null,
      rol_cod: roleItem ? roleItem.cod : null,
      next,
      menu: menuTree,
      token,
      expires_in: expiresIn,
    };
  }
}
