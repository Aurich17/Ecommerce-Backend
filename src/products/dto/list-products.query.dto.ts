import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class ListProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Texto a buscar en nombre',
    example: 'iphone',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por vendedor (usuario empresa)',
  })
  @IsOptional()
  @IsUUID()
  sellerUserId?: string;

  @ApiPropertyOptional({ description: 'Filtrar habilitados', example: 'true' })
  @IsOptional()
  @IsBooleanString()
  enabled?: string;

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
