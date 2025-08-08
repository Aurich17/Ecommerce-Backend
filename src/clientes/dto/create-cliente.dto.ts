// src/clientes/dto/create-cliente-completo.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteCompletoDto {
  @ApiProperty() nombres: string;
  @ApiProperty() apellidos: string;
  @ApiProperty() telefono: string;
  @ApiProperty({ required: false }) direccion?: string;
  @ApiProperty({ type: String, format: 'date', required: false })
  fecha_nac?: string; // ISO date string

  @ApiProperty() pais_id: number;
  @ApiProperty() provincia_id: number;
  @ApiProperty() ciudad_id: number;
  @ApiProperty() ocupacion_id: number;
  @ApiProperty() genero_id: number;

  @ApiProperty() selfie_url: string;
  @ApiProperty() dni_url: string;

  @ApiProperty() email: string;
  @ApiProperty() password_hash: string;

  @ApiProperty() alt_nombre: string;
  @ApiProperty() alt_telefono: string;
}
