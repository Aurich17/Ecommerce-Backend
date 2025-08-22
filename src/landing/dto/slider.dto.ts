import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSliderDto {
  @ApiProperty({ example: 'https://cdn.tuapp.com/slider/hero-1.jpg' })
  @IsString()
  url!: string;

  @ApiProperty({ example: 'hero-1.jpg' })
  @IsString()
  name_file!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateSliderDto {
  @ApiPropertyOptional() @IsOptional() @IsString() url?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name_file?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() status?: boolean;
}
