import { ApiPropertyOptional } from '@nestjs/swagger';
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

export class PatchProductDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() sellerUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @Min(0) price?: number;
  @ApiPropertyOptional({ description: 'MON: 001=USD, 002=PEN...' })
  @IsOptional()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  currencyCod?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) stock?: number;
  @ApiPropertyOptional() @IsOptional() @Min(0) discountPercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() urlImg?: string;
}
