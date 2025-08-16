import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class FooterResponseDto {
  @ApiProperty() contact_email!: string;
  @ApiProperty() contact_phone!: string;
  @ApiProperty() footer_title!: string;
  @ApiProperty() footer_desc!: string;
  @ApiProperty() footer_left_desc!: string;
  @ApiProperty() footer_copy!: string;
  @ApiProperty() created_at!: string;
  @ApiProperty() updated_at!: string;
}

export class UpdateFooterDto {
  @ApiPropertyOptional({ example: 'support@fiaox.com' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional({ example: '15551234567' })
  @IsOptional()
  @IsString()
  // Si quieres validar formato internacional básico:
  @Matches(/^[0-9+\-\s()]{6,20}$/, { message: 'contact_phone inválido' })
  contact_phone?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() footer_title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() footer_desc?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() footer_left_desc?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() footer_copy?: string;
}

export class CreateFooterDto {
  @ApiProperty() @IsEmail() contact_email!: string;
  @ApiProperty() @IsString() contact_phone!: string;
  @ApiProperty() @IsString() footer_title!: string;
  @ApiProperty() @IsString() footer_desc!: string;
  @ApiProperty() @IsString() footer_left_desc!: string;
  @ApiProperty() @IsString() footer_copy!: string;
}
