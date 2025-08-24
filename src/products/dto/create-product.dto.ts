import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Comercial ABC user uuid', required: false })
  @IsOptional()
  @IsUUID()
  sellerUserId?: string;

  @ApiProperty({ example: 'Silla ergonómica' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Silla con soporte lumbar y reposacabezas' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 259.9 })
  @Min(0)
  price!: number;

  @ApiProperty({ example: '001', description: 'MON: 001=USD, 002=PEN...' })
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  currencyCod!: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiPropertyOptional({ example: 15.5, description: 'Porcentaje 0..100' })
  @IsOptional()
  @Min(0)
  discountPercent?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  urlImg?: string;
}
