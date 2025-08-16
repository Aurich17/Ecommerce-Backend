import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class TipoRefDto {
  @ApiProperty({ example: 'NEG' })
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  @Transform(({ value }) => String(value).toUpperCase())
  tab!: string;
  @ApiProperty({ example: '001' })
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  cod!: string;
}
class GeoRefDto {
  @ApiProperty({ example: 'PAI' })
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
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
  @ApiProperty({ example: '010' })
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  cod!: string;
  @ApiProperty({ example: 'r2://bucket/constancia_ruc.pdf' })
  @IsString()
  storagePath!: string;
  @ApiPropertyOptional({ example: 'ruc.pdf' })
  @IsOptional()
  @IsString()
  filename?: string;
  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsOptional()
  @IsString()
  mimeType?: string;
  @ApiPropertyOptional({ example: 204800 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sizeBytes?: number;
}

export class RegisterCompanyDto {
  // Usuario representante
  @ApiProperty({ example: 'rep@empresa.com' }) @IsEmail() email!: string;
  @ApiProperty({ example: 'Secr3tPwd!' }) @IsString() password!: string;
  @ApiProperty({ example: 'Ana Pérez' }) @IsString() fullName!: string;
  @ApiPropertyOptional({ example: '+51977777777' })
  @IsOptional()
  @IsPhoneNumber('PE')
  phone?: string;

  // Perfil Empresa
  @ApiProperty({ example: 'Comercial ABC SAC' })
  @IsString()
  companyName!: string;

  @ApiProperty({ type: TipoRefDto, description: 'Tipo de negocio (NEG)' })
  @ValidateNested()
  @Type(() => TipoRefDto)
  businessType!: TipoRefDto;

  @ApiProperty({ type: GeoRefDto, description: 'País (PAI)' })
  @ValidateNested()
  @Type(() => GeoRefDto)
  country!: GeoRefDto;

  @ApiProperty({ type: GeoRefDto, description: 'Provincia (REG)' })
  @ValidateNested()
  @Type(() => GeoRefDto)
  province!: GeoRefDto;

  @ApiProperty({ type: GeoRefDto, description: 'Municipio (MUN)' })
  @ValidateNested()
  @Type(() => GeoRefDto)
  municipality!: GeoRefDto;

  @ApiPropertyOptional({ example: '2010-05-10' })
  @IsOptional()
  @IsDateString()
  foundedOn?: string;
  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @Min(0)
  employeeCount?: number;

  // Extras opcionales
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

  // Documentos
  @ApiPropertyOptional({ type: [DocumentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  documents?: DocumentDto[];
}
