// src/accesos/dto/update-acceso.dto.ts
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccesoDto {
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
