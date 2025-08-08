import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from './pais.entity';

@Injectable()
export class PaisesService {
  constructor(
    @InjectRepository(Pais)
    private readonly paisRepo: Repository<Pais>,
  ) {}

  /**
   * Devuelve todos los países.
   */
  findAll(): Promise<Pais[]> {
    return this.paisRepo.find();
  }
}
