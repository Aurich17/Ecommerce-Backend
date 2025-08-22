// src/accesos/accesos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Acceso } from './entities/acceso.entity';
import { UpdateAccesoDto } from './dto/update-acceso.dto';

@Injectable()
export class AccesosService {
  constructor(
    @InjectRepository(Acceso)
    private readonly repo: Repository<Acceso>,
  ) {}

  findByRol(idRol: number): Promise<Acceso[]> {
    return this.repo.find({
      where: { idRol },
      order: { idMenu: 'ASC' },
    });
  }

  // Actualiza por ID (fila específica)
  async updateById(id: number, dto: UpdateAccesoDto): Promise<Acceso> {
    const preload = await this.repo.preload({ id, ...dto });
    if (!preload) throw new NotFoundException(`Acceso id ${id} no existe`);
    return this.repo.save(preload);
  }

  // (Opcional) actualizar por (idRol, idMenu)
  async updateByRolMenu(
    idRol: number,
    idMenu: number,
    dto: UpdateAccesoDto,
  ): Promise<Acceso> {
    const row = await this.repo.findOne({ where: { idRol, idMenu } });
    if (!row) {
      throw new NotFoundException(
        `Acceso rol ${idRol} / menú ${idMenu} no existe`,
      );
    }
    Object.assign(row, dto);
    return this.repo.save(row);
  }
}
