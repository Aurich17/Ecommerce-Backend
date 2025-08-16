import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

export class CreateTipoDto {
  @ApiProperty({
    example: 'PAI',
    description: 'Código del catálogo (3 letras mayúsculas)',
  })
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  @Transform(({ value }) => String(value).toUpperCase())
  tab!: string;

  @ApiProperty({
    example: '001',
    description: 'Código interno del ítem (3 dígitos)',
  })
  @IsString()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  cod!: string; // manual

  @ApiProperty({ example: 'Perú', description: 'Descripción legible' })
  @IsString()
  des!: string;
}
