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
import { LoginResponse, RoleItem, MenuNode } from './auth.types';

type DbUserRow = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone_e164: string | null;
  status: string | null;
  social_security_code: string | null;
  id_rol: number | null;
  rol_descripcion: string | null;
  rol_activo: boolean | null;
};

type MenuRow = {
  id: number;
  descripcion: string;
  icono: string | null;
  is_submenu: boolean;
  id_padre: number | null;
  perm_add: boolean;
  perm_edit: boolean;
  perm_delete: boolean;
};

@Injectable()
export class AuthService {
  constructor(@InjectDataSource() private readonly ds: DataSource) {}

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

  async login(dto: LoginDto): Promise<LoginResponse> {
    const email = dto.email?.trim();
    const password = dto.password ?? '';
    if (!email || !password) {
      throw new BadRequestException('Email y password son requeridos');
    }

    // 1) Usuario + rol
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
        r.activo       AS rol_activo
      FROM public.users u
      LEFT JOIN public.rol r ON r.id = u.id_rol
      WHERE lower(u.email) = lower($1)
      LIMIT 1
      `,
      [email],
    );

    const u = rows?.[0];
    if (!u) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    if (u.status && u.status.toLowerCase() !== 'habilitado') {
      throw new ForbiddenException(`Usuario ${u.status}`);
    }
    if (u.rol_activo === false) {
      throw new ForbiddenException('Rol inactivo');
    }

    // 2) Verifica existencia de tablas (singular: public.acceso)
    const reg = await this.ds.query(
      `SELECT to_regclass('public.acceso') AS acceso, to_regclass('public.menu') AS menu;`,
    );
    const haveAcceso = !!reg?.[0]?.acceso;
    const haveMenu = !!reg?.[0]?.menu;

    // 3) Accesos del rol -> menú plano (CTE recursiva: incluye hijos de menús permitidos)
    let menuFlat: MenuRow[] = [];
    if (u.id_rol && haveAcceso && haveMenu) {
      menuFlat = await this.ds.query(
        `
        WITH RECURSIVE roots AS (
          -- raíces: menús con acceso explícito para el rol
          SELECT
            m.id,
            m.descripcion,
            m.icono,
            COALESCE(m."isSubmenu", false) AS is_submenu,
            NULLIF(m.idpadre, 0)          AS id_padre,
            COALESCE(a.add_register,    false) AS perm_add,
            COALESCE(a.edit_register,   false) AS perm_edit,
            COALESCE(a.delete_register, false) AS perm_delete
          FROM public.menu   m
          JOIN public.acceso a
            ON a.id_menu = m.id
           AND a.id_rol  = $1
           AND COALESCE(a.activo, true) = true
          WHERE COALESCE(m.activo, true) = true
        ),
        tree AS (
          SELECT * FROM roots
          UNION ALL
          -- hijos: se incluyen aunque no tengan fila en acceso;
          -- si no hay acceso propio, heredan permisos del padre
          SELECT
            c.id,
            c.descripcion,
            c.icono,
            COALESCE(c."isSubmenu", false) AS is_submenu,
            NULLIF(c.idpadre, 0)           AS id_padre,
            COALESCE(ac.add_register,    t.perm_add)    AS perm_add,
            COALESCE(ac.edit_register,   t.perm_edit)   AS perm_edit,
            COALESCE(ac.delete_register, t.perm_delete) AS perm_delete
          FROM public.menu c
          JOIN tree t
            ON t.id = c.idpadre
          LEFT JOIN public.acceso ac
            ON ac.id_menu = c.id
           AND ac.id_rol  = $1
           AND COALESCE(ac.activo, true) = true
          WHERE COALESCE(c.activo, true) = true
        )
        SELECT
          id, descripcion, icono, is_submenu, id_padre, perm_add, perm_edit, perm_delete
        FROM tree
        ORDER BY COALESCE(id_padre, 0), id
        `,
        [u.id_rol],
      );
    } else {
      console.warn(
        `[auth] Menú omitido: acceso=${haveAcceso} menu=${haveMenu} (id_rol=${u.id_rol})`,
      );
    }

    // 4) Construir árbol
    const menuTree = this.buildMenuTree(menuFlat);

    // 5) Compat con front anterior (roles)
    const roleItem: RoleItem | null =
      u.id_rol != null || u.rol_descripcion
        ? {
            tab: 'ROL',
            cod: String(u.id_rol ?? ''),
            desc: u.rol_descripcion ?? '',
          }
        : null;

    const next = this.pickNextRoute(u.id_rol, u.rol_descripcion);

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
      roles: roleItem ? [roleItem] : ([] as RoleItem[]),
      rol: roleItem ? roleItem.desc : null,
      rol_cod: roleItem ? roleItem.cod : null,
      next,
      menu: menuTree,
    };
  }
}
