import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Ciudad } from './ciudad.entity';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';

@Injectable()
export class CiudadesService {
  constructor(
    @InjectRepository(Ciudad)
    private readonly repo: Repository<Ciudad>,
  ) {}

  async create(dto: CreateCiudadDto): Promise<Ciudad> {
    // forzamos el tipo de la llamada a create
    const ciudad = this.repo.create({
      provinciaId: dto.provincia_id,
      nombre: dto.nombre,
    } as DeepPartial<Ciudad>);
    return this.repo.save(ciudad);
  }

  findAll(provinciaId?: number, includeProvincia = false) {
    if (includeProvincia) {
      return this.repo.find({
        where: provinciaId ? { provinciaId } : {},
        relations: ['provincia'],
        order: { nombre: 'ASC' },
      });
    }
    return this.repo.find({
      where: provinciaId ? { provinciaId } : {},
      select: { id: true, nombre: true, provinciaId: true }, // ← lean
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Ciudad> {
    const ciudad = await this.repo.findOne({
      where: { id },
      relations: ['provincia'],
    });
    if (!ciudad) {
      throw new NotFoundException(`Ciudad con id ${id} no encontrada`);
    }
    return ciudad;
  }

  async update(id: number, dto: UpdateCiudadDto): Promise<Ciudad> {
    await this.repo.update(id, {
      ...(dto.provincia_id !== undefined && { provinciaId: dto.provincia_id }),
      ...(dto.nombre !== undefined && { nombre: dto.nombre }),
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ciudad con id ${id} no encontrada`);
    }
  }
}
