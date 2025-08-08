import { ApiProperty } from '@nestjs/swagger';

export class CreateCiudadDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la provincia a la que pertenece',
  })
  provincia_id: number;

  @ApiProperty({ example: 'Lima', description: 'Nombre de la ciudad' })
  nombre: string;
}
