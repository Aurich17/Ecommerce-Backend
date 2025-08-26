import {
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class RegisterCompanyDto {
  // Básicos
  @IsString() company_name: string; // Razón social (basicForm.nombrecompleto)
  @IsString() ruc: string;
  @IsString() @IsOptional() phone_e164?: string; // Teléfono del representante o de la empresa
  @IsEmail() email: string; // credencialesForm.correo
  @IsString() @MinLength(6) password: string;

  // Códigos/tablas (coinciden con tu esquema)
  @IsString() @IsOptional() business_type_cod?: string; // tiponegocio (p.ej. "COMERCIO")
  @IsString() country_cod: string; // basicForm.pais (id)
  @IsString() province_cod: string; // basicForm.provincia (id)
  @IsString() municipality_cod: string; // basicForm.ciudad (id)

  // Perfil
  @IsDateString() @IsOptional() founded_on?: string; // fechafundacion
  @IsInt() @IsOptional() employee_count?: number; // numeroempleados
  @IsString() @IsOptional() fiscal_address?: string; // ubicacionForm.direccionfiscal
  @IsString() @IsOptional() city?: string; // ubicacionForm.ciudad (texto libre)
  @IsString() @IsOptional() postal_code?: string; // ubicacionForm.codigopostal
  @IsString() @IsOptional() website?: string; // ubicacionForm.sitioweb

  // Documentos (URLs ya subidas a storage)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  doc_urls?: string[]; // p.ej. ['https://.../ruc.pdf', 'https://.../licencia.jpg']

  // (Opcional) rol para este tipo de usuario
  @IsInt() @IsOptional() role_id?: number;
}
