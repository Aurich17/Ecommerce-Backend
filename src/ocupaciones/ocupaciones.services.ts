// src/ocupaciones/ocupaciones.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocupaciones } from './ocupaciones.entity';

@Injectable()
export class OcupacionesService {
  constructor(
    @InjectRepository(Ocupaciones)
    private readonly repo: Repository<Ocupaciones>,
  ) {}

  findAll(): Promise<Ocupaciones[]> {
    return this.repo.find({ order: { descripcion: 'ASC' } });
  }
}
