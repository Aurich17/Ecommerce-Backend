import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { CreateCurrencyDto } from './create-currency.dto';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {
  @ApiProperty({
    description: 'Descripción de la moneda',
    example: 'DOLARES',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Prefijo de la moneda',
    example: 'USD',
    maxLength: 10,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  prefijo?: string;

  @ApiProperty({
    description: 'Símbolo de la moneda',
    example: '$',
    maxLength: 5,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(5)
  signo?: string;

  @ApiProperty({
    description: 'Estado de la moneda',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
