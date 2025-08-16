import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingAudience } from '../entities/landing-audience.entity';
import { PagingQueryDto } from '../dto/paging.dto';
import { CreateAudienceDto, UpdateAudienceDto } from '../dto/audience.dto';

@Injectable()
export class AudiencesService {
  constructor(
    @InjectRepository(LandingAudience)
    private repo: Repository<LandingAudience>,
  ) {}

  async list(q: PagingQueryDto) {
    const qb = this.repo.createQueryBuilder('t').where('1=1');

    if (q.q)
      qb.andWhere('(t.entity ILIKE :q OR t.description ILIKE :q)', {
        q: `%${q.q}%`,
      });
    if (q.enabled !== undefined)
      qb.andWhere('t.enabled = :e', { e: q.enabled === 'true' });

    const total = await qb.getCount();

    const items = await qb
      .orderBy('t.enabled', 'DESC')
      .addOrderBy('t.position', 'ASC')
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

  async create(dto: CreateAudienceDto) {
    const ent = this.repo.create({
      icon: dto.icon,
      entity: dto.entity,
      description: dto.description,
      position: dto.position ?? 0,
      enabled: dto.enabled ?? true,
    });
    return await this.repo.save(ent);
  }

  async patch(id: number, dto: UpdateAudienceDto) {
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
