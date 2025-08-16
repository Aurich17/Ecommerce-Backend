import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class ListOrdersQueryDto {
  @ApiPropertyOptional({
    description: 'Buscar por Nro. de orden',
    example: 'ORD-',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Estado SOL (001 pend, 002 apr, 003 rej)',
  })
  @IsOptional()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  statusCod?: string;

  @ApiPropertyOptional({ description: 'Moneda MON (001 USD, 002 PEN, ...)' })
  @IsOptional()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  currencyCod?: string;

  @ApiPropertyOptional({ description: 'Comprador (userId)' })
  @IsOptional()
  @IsUUID()
  buyerUserId?: string;

  @ApiPropertyOptional({ description: 'Vendedor (userId)' })
  @IsOptional()
  @IsUUID()
  sellerUserId?: string;

  @ApiPropertyOptional({ description: 'Emitidas desde (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  issuedFrom?: string;

  @ApiPropertyOptional({ description: 'Emitidas hasta (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  issuedTo?: string;

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
