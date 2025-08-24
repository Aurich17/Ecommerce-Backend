import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'Descripción de la moneda',
    example: 'DOLARES',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @ApiProperty({
    description: 'Prefijo de la moneda',
    example: 'USD',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  prefijo: string;

  @ApiProperty({
    description: 'Símbolo de la moneda',
    example: '$',
    maxLength: 5,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  signo: string;

  @ApiProperty({
    description: 'Estado de la moneda',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean = true;
}
