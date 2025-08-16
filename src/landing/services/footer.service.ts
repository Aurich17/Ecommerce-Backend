import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingFooter } from '../entities/landing-footer.entity';
import { CreateFooterDto, UpdateFooterDto } from '../dto/footer.dto';

@Injectable()
export class FooterService {
  constructor(
    @InjectRepository(LandingFooter) private repo: Repository<LandingFooter>,
  ) {}

  private async getSingleton(): Promise<LandingFooter> {
    const row = await this.repo.findOne({ where: { id: 1 } });
    if (!row) throw new NotFoundException('Footer no configurado');
    return row;
  }

  async get() {
    return this.getSingleton();
  }

  async createIfMissing(dto: CreateFooterDto) {
    const count = await this.repo.count();
    if (count > 0) return this.get();
    const ent = this.repo.create({ ...dto });
    const saved = await this.repo.save(ent);
    // Forzamos id=1 si lo quieres fijo (no necesario si solo hay 1 fila)
    return saved;
  }

  async patch(dto: UpdateFooterDto) {
    const row = await this.getSingleton();
    Object.assign(row, dto);
    return await this.repo.save(row);
  }
}
