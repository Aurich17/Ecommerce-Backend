import { ApiProperty } from '@nestjs/swagger';

export class CreateProvinciaDto {
  @ApiProperty({ example: 1, description: 'ID del país al que pertenece' })
  pais_id: number;

  @ApiProperty({ example: 'Lima', description: 'Nombre de la provincia' })
  nombre: string;
}
