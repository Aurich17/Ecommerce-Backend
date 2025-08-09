// src/generos/generos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genero } from './genero.entity';

@Injectable()
export class GenerosService {
  constructor(
    @InjectRepository(Genero)
    private readonly repo: Repository<Genero>,
  ) {}

  findAll(): Promise<Genero[]> {
    return this.repo.find({ order: { id: 'ASC' } });
  }
}
