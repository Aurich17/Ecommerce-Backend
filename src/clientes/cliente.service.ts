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

    // 👇 Reemplaza tu query anterior por ESTA (trabaja con CÓDIGOS y URLs que envías)
    const q = `
WITH gen AS (
  -- Construye las INICIALES a partir de nombres ($1) + apellidos ($2)
  -- Toma la primera letra de cada palabra, las une y limita/pad a 4 letras
  SELECT
    CASE
      WHEN length(i_all) >= 4 THEN left(i_all, 4)
      ELSE rpad(i_all, 4, 'X')            -- si tuviera <4 palabras, rellena con X
    END AS initials,
    to_char( (floor(random()*999)+1)::int, 'FM000') AS n1,   -- 001..999
    to_char( (floor(random()*999)+1)::int, 'FM000') AS n2
  FROM (
    SELECT upper(
      array_to_string(
        ARRAY(
          SELECT left(w,1)
          FROM regexp_split_to_table( coalesce($1,'') || ' ' || coalesce($2,''), '\\s+' ) AS w
          WHERE w <> ''
        ),
        ''
      )
    ) AS i_all
  ) s
),
new_user AS (
  INSERT INTO public.users
    (id, email, password_hash, full_name, phone_e164,
     social_security_code, status, id_rol)
  SELECT
    gen_random_uuid(),
    $11, $12,
    $1 || ' ' || $2,
    $3,
    gen.initials || '-' || gen.n1 || '-' || gen.n2,   -- EJ: ICCT-123-045
    'habilitado',
    1
  FROM gen
  RETURNING id, social_security_code
),
ins_profile AS (
  INSERT INTO public.client_profiles (
    user_id, first_name, last_name, address, birth_date,
    gender_tab,     gender_cod,
    occupation_tab, occupation_cod,
    country_tab,    country_cod,
    province_tab,   province_cod,
    municipality_tab, municipality_cod,
    alt_contact_name, alt_contact_phone_e164
  )
  SELECT
    id, $1, $2, $4, $5::date,
    'GEN', UPPER(TRIM($10)),
    'OCU', UPPER(TRIM($9)),
    'PAI', UPPER(TRIM($6)),
    'REG', UPPER(TRIM($7)),
    'MUN', UPPER(TRIM($8)),
    $13, $14
  FROM new_user
)
SELECT social_security_code FROM new_user;  -- 👈 FALTABA ESTA LÍNEA
`;

    // ⚠️ Orden de parámetros = $1..$16 usados en la query
    const params = [
      dto.nombres, // $1
      dto.apellidos, // $2
      dto.telefono, // $3
      dto.direccion ?? null, // $4
      dto.fecha_nac ?? null, // $5 ::date
      dto.pais_cod, // $6
      dto.provincia_cod, // $7
      dto.ciudad_cod, // $8
      dto.ocupacion_cod, // $9
      dto.genero_cod, // $10
      dto.email, // $11
      passwordHash, // $12
      dto.alt_nombre ?? null, // $13
      dto.alt_telefono ?? null, // $14
    ];

    try {
      const rows = await this.dataSource.query(q, params);

      // La última SELECT devuelve una fila con social_security_code
      const ss =
        rows?.[0]?.social_security_code ??
        rows?.[rows.length - 1]?.social_security_code;
      return { social_security: ss };
    } catch (err: any) {
      if (err?.code === '23505') {
        // unique_violation (probable email duplicado)
        throw new ConflictException('El email ya está registrado');
      }
      throw err;
    }
  }
}
