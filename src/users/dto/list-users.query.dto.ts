import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class ListUsersQueryDto {
  @ApiPropertyOptional({
    description: 'Búsqueda por nombre/email/SSC',
    example: 'carlos',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Rol (código ROL, p.ej. 003=Cliente, 002=Empresa, 001=Admin)',
    example: '003',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  roleCod?: string;

  @ApiPropertyOptional({
    description: 'Estado de cuenta (código EST: 001/002/003)',
    example: '001',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  estCod?: string;

  @ApiPropertyOptional({ description: 'Página (1..n)', default: 1 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ description: 'Tamaño de página', default: 20 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit = 20;
}
