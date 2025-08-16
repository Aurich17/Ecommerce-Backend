import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({
    example: 'Compañía de test',
    description: 'Nombre visible en la grilla',
  })
  @IsString()
  subjectName!: string;

  @ApiPropertyOptional({ example: 'uuid-del-sujeto' })
  @IsOptional()
  @IsUUID()
  subjectUserId?: string;

  @ApiPropertyOptional({
    example: 'uuid-del-solicitante (si no viene del token)',
  })
  @IsOptional()
  @IsUUID()
  requesterUserId?: string;

  // Tipo REQ
  @ApiProperty({
    example: '001',
    description: 'REQ: 001 empresa, 002 usuario...',
  })
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  reqCod!: string;

  @ApiPropertyOptional({ example: 'Alta de empresa desde formulario' })
  @IsOptional()
  @IsString()
  description?: string;
}
