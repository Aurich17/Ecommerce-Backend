// src/accesos/dto/menu-response.dto.ts
export class MenuResponseDto {
  id: number;
  descripcion: string;
  icono?: string | null;
  isSubmenu: boolean;
  idpadre?: number | null;
  url?: string | null;
  activo: boolean;
  children?: MenuResponseDto[];
}

export class MenuWithPermissionsDto {
  id: number;
  descripcion: string;
  icono?: string | null;
  isSubmenu: boolean;
  idpadre?: number | null;
  url?: string | null;
  activo: boolean;
  permisos?: {
    accesoId?: number;
    activo: boolean;
    addRegister: boolean;
    editRegister: boolean;
    deleteRegister: boolean;
  } | null;
  children?: MenuWithPermissionsDto[];
}
