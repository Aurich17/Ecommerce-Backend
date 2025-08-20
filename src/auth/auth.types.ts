// Tipos compartidos entre controller y service

export type RoleItem = { tab: 'ROL'; cod: string; desc: string };

export interface MenuNode {
  id: number;
  label: string;
  icon?: string | null;
  isSubmenu: boolean;
  parentId: number | null;
  perms: { add: boolean; edit: boolean; delete: boolean };
  children: MenuNode[];
}

export interface LoginResponse {
  auth_ok: boolean;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone_e164: string | null;
    social_security_code: string | null;
    status: string | null;
  };
  roles: RoleItem[]; // compat con tu front
  rol: string | null; // alias de desc
  rol_cod: string | null; // alias de cod
  next: string; // '/admin' | '/empresa' | '/cliente'
  menu: MenuNode[]; // árbol de menús con permisos
}
