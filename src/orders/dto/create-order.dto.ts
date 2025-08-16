import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @ApiPropertyOptional({ example: 'uuid-product' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({ example: 'Silla ergonómica' })
  @IsString()
  productName!: string;

  @ApiProperty({ example: 2 })
  @Min(0.001)
  quantity!: number;

  @ApiProperty({ example: 199.99 })
  @Min(0)
  unitPrice!: number;
}

export class CreateOrderDto {
  @ApiPropertyOptional({ example: 'uuid-buyer' })
  @IsOptional()
  @IsUUID()
  buyerUserId?: string;

  @ApiPropertyOptional({ example: 'uuid-seller' })
  @IsOptional()
  @IsUUID()
  sellerUserId?: string;

  @ApiPropertyOptional({ example: '2025-08-16' })
  @IsOptional()
  @IsDateString()
  issuedOn?: string;

  @ApiPropertyOptional({ example: '2025-08-20' })
  @IsOptional()
  @IsDateString()
  deliveryOn?: string;

  @ApiProperty({ example: '001', description: 'MON (001 USD / 002 PEN / ...)' })
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  currencyCod!: string;

  @ApiPropertyOptional({ example: 'Entregar en almacén 2' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
