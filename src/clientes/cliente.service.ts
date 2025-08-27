// cliente.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegistroCompletoDto } from './dto/registro-completo.dto';

@Injectable()
export class ClienteService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async registrarCompleto(dto: RegistroCompletoDto) {
    const pwd = dto.password?.trim();
    if (!pwd) throw new BadRequestException('password requerido');

    const passwordHash = await bcrypt.hash(pwd, 10);

    const q = `
WITH gen AS (
  SELECT
    CASE WHEN length(i_all) >= 4 THEN left(i_all, 4) ELSE rpad(i_all, 4, 'X') END AS initials,
    to_char((floor(random()*999)+1)::int, 'FM000') AS n1,
    to_char((floor(random()*999)+1)::int, 'FM000') AS n2
  FROM (
    SELECT upper(
      array_to_string(
        ARRAY(
          SELECT left(w,1)
          FROM regexp_split_to_table(coalesce($1,'') || ' ' || coalesce($2,''), '\\s+') AS w
          WHERE w <> ''
        ), ''
      )
    ) AS i_all
  ) s
),
new_user AS (
  INSERT INTO public.users
    (id, email, password_hash, full_name, phone_e164, social_security_code, status, id_rol)
  SELECT gen_random_uuid(), $11, $12, $1 || ' ' || $2, $3,
         gen.initials || '-' || gen.n1 || '-' || gen.n2, 'habilitado', 1
  FROM gen
  RETURNING id, social_security_code
),
ins_profile AS (
  INSERT INTO public.client_profiles (
    user_id, first_name, last_name, address, birth_date,
    gender_tab, gender_cod,
    occupation_tab, occupation_cod,
    country_tab, country_cod,
    province_tab, province_cod,
    municipality_tab, municipality_cod,
    alt_contact_name, alt_contact_phone_e164
  )
  SELECT id, $1, $2, $4, $5::date,
         'GEN', UPPER(TRIM($10)),
         'OCU', UPPER(TRIM($9)),
         'PAI', UPPER(TRIM($6)),
         'REG', UPPER(TRIM($7)),
         'MUN', UPPER(TRIM($8)),
         $13, $14
  FROM new_user
  RETURNING user_id
),
ins_docs AS (
  INSERT INTO public.cliente_documentos (user_id, selfie_url, dni_reverso_url)
  SELECT user_id, $15, $16
  FROM ins_profile
)
SELECT social_security_code FROM new_user;
`;

    const params = [
      dto.nombres,
      dto.apellidos,
      dto.telefono,
      dto.direccion ?? null,
      dto.fecha_nac ?? null,
      dto.pais_cod,
      dto.provincia_cod,
      dto.ciudad_cod,
      dto.ocupacion_cod,
      dto.genero_cod,
      dto.email,
      passwordHash,
      dto.alt_nombre ?? null,
      dto.alt_telefono ?? null,
      dto.selfie_url ?? null,
      dto.dni_reverso_url ?? null,
    ];

    try {
      const rows = await this.dataSource.query(q, params);
      const ss =
        rows?.[0]?.social_security_code ??
        rows?.[rows.length - 1]?.social_security_code;
      return { social_security: ss };
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('El email ya está registrado');
      }
      throw err;
    }
  }
}
