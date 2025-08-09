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
    // 1) Validación defensiva del password
    const pwd = dto.password?.trim();
    if (!pwd) throw new BadRequestException('password requerido');

    // 2) Hash
    const saltRounds = 10; // o léelo de process.env
    const passwordHash = await bcrypt.hash(pwd, saltRounds);

    // 3) Parámetros
    const params = [
      dto.nombres,
      dto.apellidos,
      dto.telefono,
      dto.direccion ?? null,
      dto.fecha_nac ?? null, // string 'YYYY-MM-DD' → lo casteamos en la query
      dto.pais_id,
      dto.provincia_id,
      dto.ciudad_id,
      dto.ocupacion_id,
      dto.genero_id,
      dto.selfie_url,
      dto.dni_url,
      dto.email,
      passwordHash,
      dto.alt_nombre,
      dto.alt_telefono,
    ];

    try {
      // 4) Llamada con esquema + casteos
      const rows = await this.dataSource.query(
        `SELECT public.registrar_cliente_y_retornar_ss(
           $1,$2,$3,$4,$5::date,$6::int,$7::int,$8::int,$9::int,$10::int,
           $11,$12,$13,$14,$15,$16
         ) AS social_security`,
        params,
      );

      return { social_security: rows?.[0]?.social_security };
    } catch (err: any) {
      // 5) Traducción de errores comunes
      if (err?.code === '23505') {
        // unique_violation (probable email duplicado)
        throw new ConflictException('El email ya está registrado');
      }
      if (err?.code === '42883') {
        // función no existe o tipos no coinciden
        throw new BadRequestException(
          'No se encontró la función registrar_cliente_y_retornar_ss o tipos inválidos. Verifica que exista en schema public y los casteos.',
        );
      }
      throw err;
    }
  }
}
