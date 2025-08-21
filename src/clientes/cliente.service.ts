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
WITH seq AS (
  SELECT nextval('public.seq_client_ss') AS n
),
nums AS (
  SELECT
    ((n - 1) / 1000)::int + 1 AS a,
    ((n - 1) % 1000)::int + 1 AS b
  FROM seq
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
    'CLIE-' || to_char(a, 'FM000') || '-' || to_char(b, 'FM000'),  -- ✅ sin espacios
    'habilitado',
    1
  FROM nums
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
    'GEN', $10,
    'OCU', $9,
    'PAI', $6,
    'REG', $7,
    'MUN', $8,
    $13, $14
  FROM new_user
)
SELECT social_security_code FROM new_user;
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
