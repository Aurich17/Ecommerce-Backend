import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingFaq } from '../entities/landing-faq.entity';
import { PagingQueryDto } from '../dto/paging.dto';
import { CreateFaqDto, UpdateFaqDto } from '../dto/faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(LandingFaq) private repo: Repository<LandingFaq>,
  ) {}

  async list(q: PagingQueryDto) {
    const qb = this.repo.createQueryBuilder('t').where('1=1');
    if (q.q)
      qb.andWhere('(t.pregunta ILIKE :q OR t.respuesta ILIKE :q)', {
        q: `%${q.q}%`,
      });
    if (q.activo !== undefined)
      qb.andWhere('t.activo = :a', { a: q.activo === 'true' });

    const total = await qb.getCount();
    const items = await qb
      .orderBy('t.activo', 'DESC')
      .addOrderBy('t.orden', 'ASC')
      .addOrderBy('t.id', 'ASC')
      .offset((q.page - 1) * q.limit)
      .limit(q.limit)
      .getMany();

    return { items, total, page: q.page, limit: q.limit };
  }

  async getOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('FAQ no encontrada');
    return row;
  }

  async create(dto: CreateFaqDto) {
    const ent = this.repo.create({
      ...dto,
      orden: dto.orden ?? 0,
      activo: dto.activo ?? true,
    });
    return await this.repo.save(ent);
  }

  async patch(id: number, dto: UpdateFaqDto) {
    const row = await this.getOne(id);
    Object.assign(row, dto);
    return await this.repo.save(row);
  }

  async remove(id: number) {
    const row = await this.getOne(id);
    await this.repo.remove(row);
    return true;
  }
}
