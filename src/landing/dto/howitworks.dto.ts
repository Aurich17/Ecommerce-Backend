import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateHowItWorksDto {
  @ApiProperty({ example: 'store' }) @IsString() icon!: string;
  @ApiProperty({ example: 'La tienda aprueba la solicitud...' })
  @IsString()
  description!: string;
  @ApiProperty({ example: 2 }) @IsInt() @Min(0) step_order!: number;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
export class UpdateHowItWorksDto {
  @ApiPropertyOptional() @IsOptional() @IsString() icon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) step_order?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
}
