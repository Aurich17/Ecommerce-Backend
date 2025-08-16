import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { Tipo } from '../catalogs/tipo.entity';
import { ListUsersQueryDto } from './dto/list-users.query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(UserRole) private rolesRepo: Repository<UserRole>,
    @InjectRepository(Tipo) private tiposRepo: Repository<Tipo>,
  ) {}

  async list(q: ListUsersQueryDto) {
    const { page, limit, q: query, roleCod, estCod } = q;
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

    if (estCod) {
      qb.andWhere(
        `u.account_state_tab = 'EST' AND u.account_state_cod = :estCod`,
        { estCod },
      );
    }

    // Si filtras por rol: asegurar existencia en user_roles
    if (roleCod) {
      qb.andWhere(
        `EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_tab = 'ROL' AND ur.role_cod = :roleCod)`,
        { roleCod },
      );
    }

    qb.orderBy('u.created_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const [rows, total] = await Promise.all([
      qb.getRawMany(),
      // total:
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
        if (estCod) {
          countQb.andWhere(
            `u.account_state_tab = 'EST' AND u.account_state_cod = :estCod`,
            { estCod },
          );
        }
        if (roleCod) {
          countQb.andWhere(
            `EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_tab = 'ROL' AND ur.role_cod = :roleCod)`,
            { roleCod },
          );
        }
        const r = await countQb.getRawOne<{ c: string }>();
        return Number(r?.c ?? 0);
      })(),
    ]);

    // Cargar roles como array para los IDs listados
    const ids = rows.map((r) => r.id);
    let rolesByUser: Record<
      string,
      { tab: string; cod: string; desc: string }[]
    > = {};
    if (ids.length) {
      const roles = await this.rolesRepo
        .createQueryBuilder('ur')
        .innerJoin(
          Tipo,
          'rol',
          `rol.tab_tabla = ur.role_tab AND rol.cod_tipo = ur.role_cod`,
        )
        .select([
          'ur.user_id AS "userId"',
          'ur.role_tab AS tab',
          'ur.role_cod AS cod',
          'rol.des_tipo AS desc',
        ])
        .where('ur.user_id IN (:...ids)', { ids })
        .andWhere(`ur.role_tab = 'ROL'`)
        .orderBy('"userId"', 'ASC')
        .addOrderBy('cod', 'ASC')
        .getRawMany();

      rolesByUser = roles.reduce(
        (acc, r) => {
          acc[r.userId] ??= [];
          acc[r.userId].push({ tab: r.tab, cod: r.cod, desc: r.desc });
          return acc;
        },
        {} as Record<string, { tab: string; cod: string; desc: string }[]>,
      );
    }

    const items = rows.map((r) => ({
      id: r.id,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      socialSecurity: r.socialSecurity,
      status: r.status,
      roles: rolesByUser[r.id] ?? [],
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
        'est.tab_tabla AS "accountState_tab"',
        'est.cod_tipo AS "accountState_cod"',
        'est.des_tipo AS "accountState_desc"',
      ])
      .where('u.id = :id', { id })
      .getRawOne();

    if (!row) throw new NotFoundException('Usuario no encontrado');

    // roles
    const roles = await this.rolesRepo
      .createQueryBuilder('ur')
      .innerJoin(
        Tipo,
        'rol',
        `rol.tab_tabla = ur.role_tab AND rol.cod_tipo = ur.role_cod`,
      )
      .select([
        'ur.role_tab AS tab',
        'ur.role_cod AS cod',
        'rol.des_tipo AS desc',
      ])
      .where('ur.user_id = :id', { id })
      .andWhere(`ur.role_tab = 'ROL'`)
      .orderBy('cod', 'ASC')
      .getRawMany();

    return {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      socialSecurity: row.socialSecurity,
      status: row.status,
      roles,
      accountState: {
        tab: row.accountState_tab,
        cod: row.accountState_cod,
        desc: row.accountState_desc,
      },
      createdAt: row.createdAt,
    };
  }

  async patchAccountState(id: string, tab: string, cod: string) {
    // Validar que tab=EST y que el código exista
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

    // devolver el detalle actualizado
    return this.getOne(id);
  }
}
