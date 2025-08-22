import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Tipo } from '../catalogs/tipo.entity';
import { ListUsersQueryDto } from './dto/list-users.query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Tipo) private tiposRepo: Repository<Tipo>,
  ) {}

  async list(q: ListUsersQueryDto) {
    const { page, limit, q: query, roleId, estCod } = q;

    const qb = this.usersRepo
      .createQueryBuilder('u')
      .leftJoin(
        Tipo,
        'est',
        'est.tab_tabla = u.account_state_tab AND est.cod_tipo = u.account_state_cod',
      )
      .select([
        'u.id AS id',
        'u.full_name AS "fullName"',
        'u.email AS email',
        'u.phone_e164 AS phone',
        'u.social_security_code AS "socialSecurity"',
        'u.status AS status',
        'u.created_at AS "createdAt"',
        'u.id_rol AS "roleId"', // <- expone el id de rol
        'est.tab_tabla AS "accountState_tab"',
        'est.cod_tipo AS "accountState_cod"',
        'est.des_tipo AS "accountState_desc"',
      ]);

    if (query && query.trim() !== '') {
      qb.andWhere(
        `(u.full_name ILIKE :q OR u.email ILIKE :q OR u.social_security_code ILIKE :q)`,
        { q: `%${query}%` },
      );
    }

    if (typeof roleId === 'number') {
      qb.andWhere(`u.id_rol = :roleId`, { roleId });
    }

    if (estCod) {
      qb.andWhere(
        `u.account_state_tab = 'EST' AND u.account_state_cod = :estCod`,
        { estCod },
      );
    }

    qb.orderBy('u.created_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const [rows, total] = await Promise.all([
      qb.getRawMany(),
      (async () => {
        const countQb = this.usersRepo
          .createQueryBuilder('u')
          .select('COUNT(1)', 'c');

        if (query && query.trim() !== '') {
          countQb.andWhere(
            `(u.full_name ILIKE :q OR u.email ILIKE :q OR u.social_security_code ILIKE :q)`,
            { q: `%${query}%` },
          );
        }
        if (typeof roleId === 'number') {
          countQb.andWhere(`u.id_rol = :roleId`, { roleId });
        }
        if (estCod) {
          countQb.andWhere(
            `u.account_state_tab = 'EST' AND u.account_state_cod = :estCod`,
            { estCod },
          );
        }

        const r = await countQb.getRawOne<{ c: string }>();
        return Number(r?.c ?? 0);
      })(),
    ]);

    // ya no se consulta user_roles; devolvemos roleId y un array vacío de roles (si tu DTO lo pide)
    const items = rows.map((r) => ({
      id: r.id,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      socialSecurity: r.socialSecurity,
      status: r.status,
      roleId: r.roleId, // <- nuevo
      roles: [], // <- mantiene compatibilidad con respuestas anteriores
      accountState: {
        tab: r.accountState_tab,
        cod: r.accountState_cod,
        desc: r.accountState_desc,
      },
      createdAt: r.createdAt,
    }));

    return { items, total, page, limit };
  }

  async getOne(id: string) {
    const row = await this.usersRepo
      .createQueryBuilder('u')
      .leftJoin(
        Tipo,
        'est',
        'est.tab_tabla = u.account_state_tab AND est.cod_tipo = u.account_state_cod',
      )
      .select([
        'u.id AS id',
        'u.full_name AS "fullName"',
        'u.email AS email',
        'u.phone_e164 AS phone',
        'u.social_security_code AS "socialSecurity"',
        'u.status AS status',
        'u.created_at AS "createdAt"',
        'u.id_rol AS "roleId"', // <- expone el id de rol
        'est.tab_tabla AS "accountState_tab"',
        'est.cod_tipo AS "accountState_cod"',
        'est.des_tipo AS "accountState_desc"',
      ])
      .where('u.id = :id', { id })
      .getRawOne();

    if (!row) throw new NotFoundException('Usuario no encontrado');

    return {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      socialSecurity: row.socialSecurity,
      status: row.status,
      roleId: row.roleId, // <- nuevo
      roles: [], // <- sin user_roles
      accountState: {
        tab: row.accountState_tab,
        cod: row.accountState_cod,
        desc: row.accountState_desc,
      },
      createdAt: row.createdAt,
    };
  }

  async patchAccountState(id: string, tab: string, cod: string) {
    if (tab !== 'EST') {
      throw new BadRequestException(`tab debe ser 'EST'`);
    }
    const exists = await this.tiposRepo.findOne({
      where: { tab_tabla: 'EST', cod_tipo: cod },
      select: ['id'],
    });
    if (!exists) {
      throw new BadRequestException(`Estado inválido (EST:${cod})`);
    }

    const u = await this.usersRepo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');

    await this.usersRepo.update(id, {
      account_state_tab: 'EST',
      account_state_cod: cod,
      updated_at: new Date(),
    });

    return this.getOne(id);
  }
}
