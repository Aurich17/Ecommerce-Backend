import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteCompletoDto } from './dto/create-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repo: Repository<Cliente>,
    private readonly dataSource: DataSource,
  ) {}

  async registrarCompleto(
    dto: CreateClienteCompletoDto,
  ): Promise<{ social_security: string }> {
    // Prepara el arreglo de parámetros en el orden del PROCEDURE
    const params = [
      dto.nombres,
      dto.apellidos,
      dto.telefono,
      dto.direccion ?? null,
      dto.fecha_nac ?? null,
      dto.pais_id,
      dto.provincia_id,
      dto.ciudad_id,
      dto.ocupacion_id,
      dto.genero_id,
      dto.selfie_url,
      dto.dni_url,
      dto.email,
      dto.password_hash,
      dto.alt_nombre,
      dto.alt_telefono,
    ];

    // 1) Ejecuta el PROCEDURE; NOTA: CALL no devuelve el OUT en node-postgres,
    // así que luego hacemos un SELECT sobre registro_finalizado.
    await this.dataSource.query(
      `CALL public.registrar_cliente_completo(
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
       )`,
      params,
    );

    // 2) Obtén el último registro_insertado para devolver el OUT parameter
    const result = await this.dataSource.query(`
      SELECT social_security 
      FROM registro_finalizado
      ORDER BY cliente_id DESC
      LIMIT 1
    `);

    return { social_security: result[0].social_security };
  }
}
