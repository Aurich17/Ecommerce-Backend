import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TipoRefOptionalDto {
  @ApiPropertyOptional({ example: 'GEN' })
  @IsOptional()
  @IsString()
  tab?: string;
  @ApiPropertyOptional({ example: '001' })
  @IsOptional()
  @IsString()
  cod?: string;
}

export class PatchClientDto {
  @ApiPropertyOptional({ example: 'Carlos' })
  @IsOptional()
  @IsString()
  firstName?: string;
  @ApiPropertyOptional({ example: 'Chumpitaz' })
  @IsOptional()
  @IsString()
  lastName?: string;
  @ApiPropertyOptional({ example: 'Av. Siempre Viva 123' })
  @IsOptional()
  @IsString()
  address?: string;
  @ApiPropertyOptional({ example: '1990-06-01' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ type: TipoRefOptionalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefOptionalDto)
  gender?: TipoRefOptionalDto;
  @ApiPropertyOptional({ type: TipoRefOptionalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefOptionalDto)
  occupation?: TipoRefOptionalDto;
  @ApiPropertyOptional({ type: TipoRefOptionalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefOptionalDto)
  country?: TipoRefOptionalDto;
  @ApiPropertyOptional({ type: TipoRefOptionalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefOptionalDto)
  province?: TipoRefOptionalDto;
  @ApiPropertyOptional({ type: TipoRefOptionalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefOptionalDto)
  municipality?: TipoRefOptionalDto;

  @ApiPropertyOptional({ example: 'Contacto X' })
  @IsOptional()
  @IsString()
  altContactName?: string;
  @ApiPropertyOptional({ example: '+51988888888' })
  @IsOptional()
  @IsString()
  altContactPhone?: string;
}
