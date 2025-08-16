import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty() @IsString() pregunta!: string;
  @ApiProperty() @IsString() respuesta!: string;
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
export class UpdateFaqDto {
  @ApiPropertyOptional() @IsOptional() @IsString() pregunta?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() respuesta?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) orden?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() activo?: boolean;
}
