import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class PatchAccountStateDto {
  @ApiProperty({ example: 'EST', description: 'Debe ser EST' })
  @IsString()
  @Length(3, 3)
  @Matches(/^EST$/)
  tab!: string;

  @ApiProperty({
    example: '002',
    description: 'Código EST: 001=PENDIENTE, 002=APROBADO, 003=RECHAZADO',
  })
  @IsString()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  cod!: string;
}
