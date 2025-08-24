# API de Gestión de Permisos

**Base URL:** `http://localhost:3000`

## Endpoints

### 1. Listar Menús
```http
GET /accesos/menus
```
**Descripción**: Obtiene todos los menús activos en estructura jerárquica
**Response**: Array de MenuResponseDto con submenús anidados en `children`
**Uso**: Para construir el menú de navegación con estructura de árbol
**Estructura**: Los menús principales contienen sus submenús en la propiedad `children`
```typescript
MenuResponseDto[] = {
  id: number;
  descripcion: string;
  icono: string;
  isSubmenu: boolean;
  idpadre: number | null;
  url: string;
  activo: boolean;
  children: MenuResponseDto[];
}
```

### 2. Menús con Permisos por Rol
```http
GET /accesos/rol/{idRol}/menus-permisos
```
**Descripción**: Obtiene menús con permisos en estructura jerárquica para un rol
**Parámetros**: idRol (number)
**Response**: Array de MenuWithPermissionsDto con submenús anidados
**Uso**: Para mostrar menús según permisos del rol con estructura de árbol
**Estructura**: Cada menú incluye sus permisos y submenús anidados en `children`
```typescript
MenuWithPermissionsDto[] = {
  id: number;
  descripcion: string;
  icono: string;
  isSubmenu: boolean;
  idpadre: number | null;
  url: string;
  activo: boolean;
  permisos: {
    accesoId: number;
    activo: boolean;
    addRegister: boolean;
    editRegister: boolean;
    deleteRegister: boolean;
  };
  children: MenuWithPermissionsDto[];
}
```

### 3. Actualización Masiva de Permisos
```http
PATCH /accesos/rol/{idRol}/permisos-masivos
```
**Request:**
```typescript
BulkUpdatePermissionsDto = {
  permisos: [{
    idMenu: number;
    activo?: boolean;
    addRegister?: boolean;
    editRegister?: boolean;
    deleteRegister?: boolean;
  }]
}
```
**Response:** `{updated: number, created: number}`

### 4. Crear Acceso
```http
POST /accesos
```
**Request:**
```typescript
CreateAccesoDto = {
  idRol: number;
  idMenu: number;
  activo?: boolean;
  addRegister?: boolean;
  editRegister?: boolean;
  deleteRegister?: boolean;
}
```

## DTOs Principales

### MenuResponseDto (Estructura Jerárquica)
```typescript
export class MenuResponseDto {
  id: number;
  descripcion: string;
  icono: string;
  isSubmenu: boolean;
  idpadre: number | null;
  url: string;
  activo: boolean;
  children: MenuResponseDto[]; // Submenús anidados
}
```

### MenuWithPermissionsDto (Estructura Jerárquica)
```typescript
export class MenuWithPermissionsDto {
  id: number;
  descripcion: string;
  icono: string;
  isSubmenu: boolean;
  idpadre: number | null;
  url: string;
  activo: boolean;
  permisos: {
    accesoId: number;
    activo: boolean;
    addRegister: boolean;
    editRegister: boolean;
    deleteRegister: boolean;
  };
  children: MenuWithPermissionsDto[]; // Submenús anidados con permisos
}
```

### BulkUpdatePermissionsDto
```typescript
export class BulkUpdatePermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionUpdateDto)
  permisos: PermissionUpdateDto[];
}

export class PermissionUpdateDto {
  @IsNumber()
  idMenu: number;
  
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
  
  @IsOptional()
  @IsBoolean()
  addRegister?: boolean;
  
  @IsOptional()
  @IsBoolean()
  editRegister?: boolean;
  
  @IsOptional()
  @IsBoolean()
  deleteRegister?: boolean;
}
```

### CreateAccesoDto
```typescript
export class CreateAccesoDto {
  @IsNumber()
  idRol: number;
  
  @IsNumber()
  idMenu: number;
  
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
  
  @IsOptional()
  @IsBoolean()
  addRegister?: boolean;
  
  @IsOptional()
  @IsBoolean()
  editRegister?: boolean;
  
  @IsOptional()
  @IsBoolean()
  deleteRegister?: boolean;
}
```

## Servicios Angular

```typescript
// Obtener todos los menús
getAllMenus(): Observable<MenuResponseDto[]> {
  return this.http.get<MenuResponseDto[]>(`${this.baseUrl}/accesos/menus`);
}

// Obtener permisos de un rol
getRolePermissions(roleId: number): Observable<MenuWithPermissionsDto[]> {
  return this.http.get<MenuWithPermissionsDto[]>(
    `${this.baseUrl}/accesos/rol/${roleId}/menus-permisos`
  );
}

// Actualizar permisos masivamente
bulkUpdatePermissions(
  roleId: number, 
  permissions: BulkUpdatePermissionsDto
): Observable<{updated: number, created: number}> {
  return this.http.patch<{updated: number, created: number}>(
    `${this.baseUrl}/accesos/rol/${roleId}/permisos-masivos`,
    permissions
  );
}

// Crear nuevo acceso
createAccess(access: CreateAccesoDto): Observable<any> {
  return this.http.post(`${this.baseUrl}/accesos`, access);
}
```

## Características

- ✅ Validación con class-validator
- ✅ Documentación Swagger automática
- ✅ Transacciones atómicas
- ✅ Filtrado por rol activo
- ✅ Prevención de duplicados
- ✅ API ejecutándose en puerto 3000
- ✅ Todos los endpoints probados

## Notas

1. **Filtrado:** Solo devuelve menús con accesos asignados al rol
2. **Opcionales:** Campos de permisos son opcionales en actualizaciones
3. **Transacciones:** Operaciones masivas son atómicas
4. **Duplicados:** Sistema previene accesos duplicados (rol + menú)

---
**Versión:** 1.0.0 | **Stack:** NestJS + TypeScript + Supabase