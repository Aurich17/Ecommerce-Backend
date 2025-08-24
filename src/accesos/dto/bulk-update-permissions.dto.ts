// src/accesos/dto/bulk-update-permissions.dto.ts
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PermissionUpdateDto {
  @IsInt()
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

export class BulkUpdatePermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionUpdateDto)
  permisos: PermissionUpdateDto[];
}

export class CreateAccesoDto {
  @IsInt()
  idRol: number;

  @IsInt()
  idMenu: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;

  @IsOptional()
  @IsBoolean()
  addRegister?: boolean = false;

  @IsOptional()
  @IsBoolean()
  editRegister?: boolean = false;

  @IsOptional()
  @IsBoolean()
  deleteRegister?: boolean = false;
}
