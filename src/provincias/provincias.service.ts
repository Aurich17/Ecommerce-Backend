import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provincia } from './provincia.entity';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { UpdateProvinciaDto } from './dto/update-provincia.dto';

@Injectable()
export class ProvinciasService {
  constructor(
    @InjectRepository(Provincia)
    private readonly repo: Repository<Provincia>,
  ) {}

  async create(dto: CreateProvinciaDto): Promise<Provincia> {
    const provincia = this.repo.create(dto);
    return this.repo.save(provincia);
  }

  findAll(): Promise<Provincia[]> {
    return this.repo.find({ relations: ['pais'] });
  }

  async findOne(id: number): Promise<Provincia> {
    const provincia = await this.repo.findOne({
      where: { id },
      relations: ['pais'],
    });
    if (!provincia) {
      throw new NotFoundException(`Provincia con id ${id} no encontrada`);
    }
    return provincia;
  }

  async update(id: number, dto: UpdateProvinciaDto): Promise<Provincia> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Provincia con id ${id} no encontrada`);
    }
  }
}
