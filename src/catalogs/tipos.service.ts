import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tipo } from './tipo.entity';
import { CreateTipoDto } from './dto/create-tipo.dto';

@Injectable()
export class TiposService {
  constructor(@InjectRepository(Tipo) private repo: Repository<Tipo>) {}

  async findByTab(tab: string) {
    const rows = await this.repo
      .createQueryBuilder('t')
      .select([
        't.tab_tabla AS tab',
        't.cod_tipo AS cod',
        't.des_tipo AS "desc"',
      ])
      .where('t.tab_tabla = :tab', { tab })
      .orderBy('t.cod_tipo', 'ASC')
      .getRawMany();
    return rows;
  }

  async findOne(tab: string, cod: string) {
    const row = await this.repo
      .createQueryBuilder('t')
      .select([
        't.tab_tabla AS tab',
        't.cod_tipo AS cod',
        't.des_tipo AS "desc"',
      ])
      .where('t.tab_tabla = :tab AND t.cod_tipo = :cod', { tab, cod })
      .getRawOne();
    if (!row) throw new NotFoundException('Tipo no encontrado');
    return row;
  }

  async create(dto: CreateTipoDto) {
    try {
      const entity = this.repo.create({
        tab_tabla: dto.tab,
        cod_tipo: dto.cod,
        des_tipo: dto.des,
      });
      const saved = await this.repo.save(entity);
      return {
        tab: saved.tab_tabla,
        cod: saved.cod_tipo,
        desc: saved.des_tipo,
      };
    } catch (e: any) {
      // 23505 = unique_violation
      if (e?.code === '23505') {
        throw new ConflictException('El par (tab, cod) ya existe');
      }
      throw e;
    }
  }
}
