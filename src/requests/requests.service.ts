import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestEntity } from './entities/request.entity';
import { ListRequestsQueryDto } from './dto/list-requests.query.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { PatchRequestStatusDto } from './dto/patch-status.dto';
import { Tipo } from '../catalogs/tipo.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(RequestEntity) private repo: Repository<RequestEntity>,
    @InjectRepository(Tipo) private tiposRepo: Repository<Tipo>,
  ) {}

  async list(q: ListRequestsQueryDto) {
    const qb = this.repo.createQueryBuilder('r').where('1=1');

    if (q.reqCod)
      qb.andWhere(`r.req_tab='REQ' AND r.req_cod = :rc`, { rc: q.reqCod });
    if (q.estCod)
      qb.andWhere(`r.status_tab='EST' AND r.status_cod = :ec`, {
        ec: q.estCod,
      });
    if (q.q)
      qb.andWhere('(r.subject_name ILIKE :q OR r.description ILIKE :q)', {
        q: `%${q.q}%`,
      });

    const total = await qb.getCount();
    const items = await qb
      .orderBy('r.created_at', 'DESC')
      .offset((q.page - 1) * q.limit)
      .limit(q.limit)
      .getMany();

    return {
      items: items.map(this.mapItem),
      total,
      page: q.page,
      limit: q.limit,
    };
  }

  async getOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Solicitud no encontrada');
    return this.mapItem(row);
  }

  async create(dto: CreateRequestDto) {
    // Validar REQ
    await this.assertTipo('REQ', dto.reqCod);

    const entity = this.repo.create({
      requester_user_id: dto.requesterUserId ?? null,
      subject_user_id: dto.subjectUserId ?? null,
      subject_name: dto.subjectName,
      req_tab: 'REQ',
      req_cod: dto.reqCod,
      status_tab: 'EST',
      status_cod: '001', // Pendiente
      description: dto.description ?? null,
    });

    const saved = await this.repo.save(entity);
    return this.mapItem(saved);
  }

  async patchStatus(
    id: number,
    body: PatchRequestStatusDto,
    reviewerUserId?: string,
  ) {
    if (body.tab !== 'EST') throw new BadRequestException(`tab debe ser 'EST'`);
    await this.assertTipo('EST', body.cod);

    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Solicitud no encontrada');

    row.status_tab = 'EST';
    row.status_cod = body.cod;
    row.review_notes = body.notes ?? null;
    row.reviewed_by = reviewerUserId ?? null;
    row.reviewed_at = new Date();

    await this.repo.save(row);
    return this.mapItem(row);
  }

  // ---- helpers ----
  private async assertTipo(tab: string, cod: string) {
    const ok = await this.tiposRepo.findOne({
      where: { tab_tabla: tab, cod_tipo: cod },
      select: ['id'],
    });
    if (!ok) throw new BadRequestException(`Tipo inexistente (${tab}:${cod})`);
  }

  private mapItem = (r: RequestEntity) => ({
    id: r.id,
    subjectName: r.subject_name,
    subjectUserId: r.subject_user_id,
    requesterUserId: r.requester_user_id,
    reqTab: r.req_tab,
    reqCod: r.req_cod,
    statusTab: r.status_tab,
    statusCod: r.status_cod,
    description: r.description,
    createdAt: r.created_at,
    reviewedBy: r.reviewed_by,
    reviewedAt: r.reviewed_at,
    reviewNotes: r.review_notes,
  });
}
