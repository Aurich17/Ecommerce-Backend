import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class TipoRefDto {
  @ApiProperty({ example: 'GEN' })
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  @Transform(({ value }) => String(value).toUpperCase())
  tab!: string;

  @ApiProperty({ example: '001' })
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  cod!: string;
}

class DocumentDto {
  @ApiProperty({ example: 'DOC' })
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  tab!: string;
  @ApiProperty({ example: '001' })
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  cod!: string;
  @ApiProperty({ example: 'r2://bucket/selfie.jpg' })
  @IsString()
  storagePath!: string;

  @ApiPropertyOptional({ example: 'selfie.jpg' })
  @IsOptional()
  @IsString()
  filename?: string;
  @ApiPropertyOptional({ example: 'image/jpeg' })
  @IsOptional()
  @IsString()
  mimeType?: string;
  @ApiPropertyOptional({ example: 123456 }) @IsOptional() sizeBytes?: number;
}

export class RegisterClientDto {
  // User
  @ApiProperty({ example: 'carlos@example.com' }) @IsEmail() email!: string;
  @ApiProperty({ example: 'Secr3tPwd!' }) @IsString() password!: string;
  @ApiProperty({ example: 'Carlos Ismael Chumpitaz Torres' })
  @IsString()
  fullName!: string;
  @ApiPropertyOptional({ example: '+51999999999' })
  @IsOptional()
  @IsPhoneNumber('PE')
  phone?: string;

  // Perfil
  @ApiProperty({ example: 'Carlos Ismael' }) @IsString() firstName!: string;
  @ApiProperty({ example: 'Chumpitaz Torres' }) @IsString() lastName!: string;
  @ApiPropertyOptional({ example: 'Av. Siempre Viva 123' })
  @IsOptional()
  @IsString()
  address?: string;
  @ApiPropertyOptional({ example: '1990-06-01' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ type: TipoRefDto, description: 'Género (GEN)' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefDto)
  gender?: TipoRefDto;

  @ApiPropertyOptional({ type: TipoRefDto, description: 'Ocupación (OCU)' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefDto)
  occupation?: TipoRefDto;

  @ApiPropertyOptional({ type: TipoRefDto, description: 'País (PAI)' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefDto)
  country?: TipoRefDto;

  @ApiPropertyOptional({ type: TipoRefDto, description: 'Provincia (REG)' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefDto)
  province?: TipoRefDto;

  @ApiPropertyOptional({ type: TipoRefDto, description: 'Municipio (MUN)' })
  @IsOptional()
  @ValidateNested()
  @Type(() => TipoRefDto)
  municipality?: TipoRefDto;

  // Contacto alterno
  @ApiPropertyOptional({ example: 'Contacto X' })
  @IsOptional()
  @IsString()
  altContactName?: string;
  @ApiPropertyOptional({ example: '+51988888888' })
  @IsOptional()
  @IsString()
  altContactPhone?: string;

  // Docs
  @ApiPropertyOptional({ type: [DocumentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}
