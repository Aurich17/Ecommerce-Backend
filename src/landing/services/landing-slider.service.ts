import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingSlider } from '../entities/landing-slider.entity';
import { PagingQueryDto } from '../dto/paging.dto';
import { CreateSliderDto, UpdateSliderDto } from '../dto/slider.dto';

@Injectable()
export class LandingSliderService {
  constructor(
    @InjectRepository(LandingSlider)
    private repo: Repository<LandingSlider>,
  ) {}

  async list(q: PagingQueryDto & { status?: string }) {
    const qb = this.repo.createQueryBuilder('t').where('1=1');

    if (q.q) {
      qb.andWhere('(t.name_file ILIKE :q OR t.url ILIKE :q)', {
        q: `%${q.q}%`,
      });
    }

    if (q.status !== undefined) {
      qb.andWhere('t.status = :s', { s: q.status === 'true' });
    }

    // Normaliza page/limit para evitar NaN en offset/limit
    const pageNum = Number(q.page);
    const limitNum = Number(q.limit);
    const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
    const limit = Number.isFinite(limitNum) && limitNum > 0 ? limitNum : 10;

    const total = await qb.getCount();

    const items = await qb
      .orderBy('t.status', 'DESC')
      .addOrderBy('t.id', 'ASC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

    return { items, total, page, limit };
  }

  async getOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Registro no encontrado');
    return row;
  }

  async create(dto: CreateSliderDto) {
    const ent = this.repo.create({
      url: dto.url,
      name_file: dto.name_file,
      status: dto.status ?? true,
    });
    return await this.repo.save(ent);
  }

  async patch(id: number, dto: UpdateSliderDto) {
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
