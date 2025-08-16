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

export class ListRequestsQueryDto {
  @ApiPropertyOptional({
    example: '001',
    description: 'Tipo REQ (001 empresa, 002 usuario...)',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  reqCod?: string;

  @ApiPropertyOptional({
    example: '001',
    description: 'Estado EST (001/002/003)',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  estCod?: string;

  @ApiPropertyOptional({ description: 'Búsqueda en subject_name/description' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ default: 1 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 20 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit = 20;
}
