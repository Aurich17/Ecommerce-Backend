import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingTestimonial } from '../entities/landing-testimonial.entity';
import { PagingQueryDto } from '../dto/paging.dto';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
} from '../dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(LandingTestimonial)
    private repo: Repository<LandingTestimonial>,
  ) {}

  async list(q: PagingQueryDto) {
    const qb = this.repo.createQueryBuilder('t').where('1=1');
    if (q.q)
      qb.andWhere('(t.comment ILIKE :q OR t.client_name ILIKE :q)', {
        q: `%${q.q}%`,
      });
    if (q.enabled !== undefined)
      qb.andWhere('t.enabled = :e', { e: q.enabled === 'true' });

    const total = await qb.getCount();
    const items = await qb
      .orderBy('t.enabled', 'DESC')
      .addOrderBy('t.created_at', 'DESC')
      .addOrderBy('t.id', 'DESC')
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

  async create(dto: CreateTestimonialDto) {
    const ent = this.repo.create({
      comment: dto.comment,
      user_id: dto.userId ?? null,
      client_name: dto.clientName ?? null,
      occupation_text: dto.occupationText ?? null,
      occupation_tab: dto.occupationTab ?? 'OCU',
      occupation_cod: dto.occupationCod ?? null,
      enabled: dto.enabled ?? true,
    });
    return await this.repo.save(ent);
  }

  async patch(id: number, dto: UpdateTestimonialDto) {
    const row = await this.getOne(id);
    Object.assign(row, {
      comment: dto.comment ?? row.comment,
      user_id: dto.userId ?? row.user_id,
      client_name: dto.clientName ?? row.client_name,
      occupation_text: dto.occupationText ?? row.occupation_text,
      occupation_tab: dto.occupationTab ?? row.occupation_tab,
      occupation_cod: dto.occupationCod ?? row.occupation_cod,
      enabled: dto.enabled ?? row.enabled,
      updated_at: new Date(),
    });
    return await this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.getOne(id);
    await this.repo.remove(row);
    return true;
  }
}
