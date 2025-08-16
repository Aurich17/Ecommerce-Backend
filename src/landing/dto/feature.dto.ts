import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty({ example: 'lock-keyhole' }) @IsString() icono!: string;
  @ApiProperty({ example: 'Protección de Información' })
  @IsString()
  titulo!: string;
  @ApiProperty({ example: 'Tu información protegida...' })
  @IsString()
  descripcion!: string;
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
export class UpdateFeatureDto {
  @ApiPropertyOptional() @IsOptional() @IsString() icono?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() titulo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() descripcion?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) orden?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() activo?: boolean;
}
