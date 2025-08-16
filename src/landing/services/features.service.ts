import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingFeature } from '../entities/landing-feature.entity';
import { PagingQueryDto } from '../dto/paging.dto';
import { CreateFeatureDto, UpdateFeatureDto } from '../dto/feature.dto';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(LandingFeature) private repo: Repository<LandingFeature>,
  ) {}

  async list(q: PagingQueryDto) {
    const qb = this.repo.createQueryBuilder('t').where('1=1');
    if (q.q)
      qb.andWhere('(t.titulo ILIKE :q OR t.descripcion ILIKE :q)', {
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
    if (!row) throw new NotFoundException('Característica no encontrada');
    return row;
  }

  async create(dto: CreateFeatureDto) {
    const ent = this.repo.create({
      ...dto,
      orden: dto.orden ?? 0,
      activo: dto.activo ?? true,
    });
    return await this.repo.save(ent);
  }

  async patch(id: number, dto: UpdateFeatureDto) {
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
