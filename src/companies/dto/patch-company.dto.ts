import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TipoRefOptionalDto {
  @ApiPropertyOptional({ example: 'NEG' }) tab?: string;
  @ApiPropertyOptional({ example: '001' }) cod?: string;
}
class GeoRefOptionalDto {
  @ApiPropertyOptional({ example: 'PAI' }) tab?: string;
  @ApiPropertyOptional({ example: '001' }) cod?: string;
}

export class PatchCompanyDto {
  @ApiPropertyOptional({ example: 'Comercial ABC SAC' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ type: TipoRefOptionalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefOptionalDto)
  businessType?: TipoRefOptionalDto;
  @ApiPropertyOptional({ type: GeoRefOptionalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoRefOptionalDto)
  country?: GeoRefOptionalDto;
  @ApiPropertyOptional({ type: GeoRefOptionalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoRefOptionalDto)
  province?: GeoRefOptionalDto;
  @ApiPropertyOptional({ type: GeoRefOptionalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoRefOptionalDto)
  municipality?: GeoRefOptionalDto;

  @ApiPropertyOptional({ example: '2010-05-10' })
  @IsOptional()
  @IsDateString()
  foundedOn?: string;
  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @Min(0)
  employeeCount?: number;

  @ApiPropertyOptional({ example: 'Av. Industrial 456' })
  @IsOptional()
  @IsString()
  fiscalAddress?: string;
  @ApiPropertyOptional({ example: 'Lima' })
  @IsOptional()
  @IsString()
  city?: string;
  @ApiPropertyOptional({ example: '15001' })
  @IsOptional()
  @IsString()
  postalCode?: string;
  @ApiPropertyOptional({ example: 'https://abc.com' })
  @IsOptional()
  @IsString()
  website?: string;
}
