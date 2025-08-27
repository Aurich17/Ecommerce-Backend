export type RoleItem = { tab: 'ROL'; cod: string; desc: string };

export interface MenuNode {
  id: number;
  label: string;
  icon?: string | null;
  isSubmenu: boolean;
  parentId: number | null;
  url: string | null; // << añadido
  perms: { add: boolean; edit: boolean; delete: boolean };
  children: MenuNode[];
}

export type LoginResponse = {
  auth_ok: boolean;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone_e164: string | null;
    social_security_code: string | null;
    status: string | null;
    accountState?: { tab: string; cod: string; desc: string }; // 👈 agregar
  };
  roles: RoleItem[];
  rol: string | null;
  rol_cod: string | null;
  next: string;
  menu: MenuNode[];
  token: string;
  expires_in: number;
};

export interface JwtPayload {
  sub: string; // user id
  email: string;
  rol_cod: string | null;
  rol: string | null;
}
