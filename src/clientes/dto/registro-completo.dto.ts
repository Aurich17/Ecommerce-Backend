import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegistroCompletoDto {
  @ApiProperty() @IsString() @IsNotEmpty() nombres: string;
  @ApiProperty() @IsString() @IsNotEmpty() apellidos: string;
  @ApiProperty() @IsString() @IsNotEmpty() telefono: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  direccion?: string;
  @ApiProperty({ required: false, example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  fecha_nac?: string;

  @ApiProperty() @IsInt() pais_id: number;
  @ApiProperty() @IsInt() provincia_id: number;
  @ApiProperty() @IsInt() ciudad_id: number;
  @ApiProperty() @IsInt() ocupacion_id: number;
  @ApiProperty() @IsInt() genero_id: number;

  @ApiProperty() @IsString() @IsNotEmpty() selfie_url: string;
  @ApiProperty() @IsString() @IsNotEmpty() dni_url: string;

  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @IsNotEmpty() password: string;

  @ApiProperty() @IsString() @IsNotEmpty() alt_nombre: string;
  @ApiProperty() @IsString() @IsNotEmpty() alt_telefono: string;
}
