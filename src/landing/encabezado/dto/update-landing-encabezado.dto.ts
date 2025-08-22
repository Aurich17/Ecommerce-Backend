import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLandingEncabezadoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titulo_principal?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitulo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parrafo_encabezado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  titulo_marketplace?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitulo_marketplace?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nota?: string | null;

  // 👇 NUEVOS CAMPOS PARA EL LOGO
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo_name?: string;
}
