import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MaxLength(255)
  descripcion: string;

  @IsOptional()
  @IsString()
  usercrea?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean; // default true
}
