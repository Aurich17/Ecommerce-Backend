// dto/registro-completo.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsDateString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class RegistroCompletoDto {
  @ApiProperty() @IsString() @IsNotEmpty() nombres: string;
  @ApiProperty() @IsString() @IsNotEmpty() apellidos: string;

  @ApiProperty({ example: '+51984111111' })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiPropertyOptional() @IsOptional() @IsString() direccion?: string;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  fecha_nac?: string;

  // === Opción "códigos" (lo que envía tu front)
  @ApiPropertyOptional() @IsOptional() @IsString() pais_cod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() provincia_cod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ciudad_cod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ocupacion_cod?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() genero_cod?: string;

  // === IDs opcionales (si algún cliente los manda)
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pais_id?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  provincia_id?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ciudad_id?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ocupacion_id?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  genero_id?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() selfie_url?: string;

  // 👇 lo agregamos solo para pasar el ValidationPipe (aunque el SP no lo use)
  @ApiPropertyOptional() @IsOptional() @IsString() dni_reverso_url?: string;

  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @IsNotEmpty() password: string;

  @ApiPropertyOptional() @IsOptional() @IsString() alt_nombre?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() alt_telefono?: string;
}
