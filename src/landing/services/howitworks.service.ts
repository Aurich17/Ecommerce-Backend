import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingHowItWorks } from '../entities/landing-howitworks.entity';
import { PagingQueryDto } from '../dto/paging.dto';
import {
  CreateHowItWorksDto,
  UpdateHowItWorksDto,
} from '../dto/howitworks.dto';

@Injectable()
export class HowItWorksService {
  constructor(
    @InjectRepository(LandingHowItWorks)
    private repo: Repository<LandingHowItWorks>,
  ) {}

  async list(q: PagingQueryDto) {
    const qb = this.repo.createQueryBuilder('t').where('1=1');
    if (q.q) qb.andWhere('t.description ILIKE :q', { q: `%${q.q}%` });
    if (q.enabled !== undefined)
      qb.andWhere('t.enabled = :e', { e: q.enabled === 'true' });

    const total = await qb.getCount();
    const items = await qb
      .orderBy('t.enabled', 'DESC')
      .addOrderBy('t.step_order', 'ASC')
      .addOrderBy('t.id', 'ASC')
      .offset((q.page - 1) * q.limit)
      .limit(q.limit)
      .getMany();
    return { items, total, page: q.page, limit: q.limit };
  }

  async getOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Registro no encontrado');
    return row;
  }

  async create(dto: CreateHowItWorksDto) {
    const ent = this.repo.create({
      icon: dto.icon,
      description: dto.description,
      step_order: dto.step_order,
      enabled: dto.enabled ?? true,
    });
    return await this.repo.save(ent);
  }

  async patch(id: number, dto: UpdateHowItWorksDto) {
    const row = await this.getOne(id);
    Object.assign(row, dto, { updated_at: new Date() });
    return await this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.getOne(id);
    await this.repo.remove(row);
    return true;
  }
}
