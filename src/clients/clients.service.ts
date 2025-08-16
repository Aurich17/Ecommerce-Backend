import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { Tipo } from '../catalogs/tipo.entity';
import { ClientProfile } from './entities/client-profile.entity';
import { UserDocument } from './entities/user-document.entity';
import { RegisterClientDto } from './dto/register-client.dto';
import { PatchClientDto } from './dto/patch-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly ds: DataSource,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(UserRole) private rolesRepo: Repository<UserRole>,
    @InjectRepository(Tipo) private tiposRepo: Repository<Tipo>,
    @InjectRepository(ClientProfile)
    private clientRepo: Repository<ClientProfile>,
    @InjectRepository(UserDocument) private docRepo: Repository<UserDocument>,
  ) {}

  // --- helpers ---
  private normalizeName(s: string) {
    return s
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toUpperCase();
  }
  private sscFromFullName(fullName: string) {
    const cleaned = this.normalizeName(fullName);
    const toks = cleaned
      .split(/\s+/)
      .filter(Boolean)
      .filter(
        (t) =>
          ![
            'DE',
            'DEL',
            'LA',
            'LAS',
            'LOS',
            'Y',
            'DA',
            'DOS',
            'DAS',
            'DO',
          ].includes(t),
      );
    const n = toks.length;
    const a = n >= 1 ? toks[0][0] : 'X';
    const b = n >= 2 ? toks[1][0] : 'X';
    const c = n >= 3 ? toks[n - 2][0] : 'X';
    const d = n >= 1 ? toks[n - 1][0] : 'X';
    return (a + b + c + d).padEnd(4, 'X');
  }
  private async generateUniqueSSC(fullName: string): Promise<string> {
    const prefix = this.sscFromFullName(fullName);
    for (let i = 0; i < 50; i++) {
      const n1 = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
      const n2 = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
      const code = `${prefix}-${n1}-${n2}`;
      const exists = await this.usersRepo.findOne({
        where: { social_security_code: code },
        select: ['id'],
      });
      if (!exists) return code;
    }
    throw new ConflictException('No se pudo generar SSC único');
  }
  private async assertTipoExists(tab: string, cod: string) {
    const ok = await this.tiposRepo.findOne({
      where: { tab_tabla: tab, cod_tipo: cod },
      select: ['id'],
    });
    if (!ok) throw new BadRequestException(`Tipo inexistente (${tab}:${cod})`);
  }

  // --- API ---
  async register(dto: RegisterClientDto) {
    // Validar combos tipo si vienen
    const checks: [string, string | undefined][] = [
      ['GEN', dto.gender?.cod],
      ['OCU', dto.occupation?.cod],
      ['PAI', dto.country?.cod],
      ['REG', dto.province?.cod],
      ['MUN', dto.municipality?.cod],
    ];
    for (const [tab, cod] of checks) {
      if (cod) await this.assertTipoExists(tab, cod);
    }

    // Transacción
    return await this.ds.transaction(async (trx) => {
      // 1) user
      const ssc = await this.generateUniqueSSC(dto.fullName);
      const user = trx.getRepository(User).create({
        email: dto.email,
        password_hash: dto.password, // OJO: aquí debes hashear en tu capa real
        full_name: dto.fullName,
        phone_e164: dto.phone ?? null,
        social_security_code: ssc,
        account_state_tab: 'EST',
        account_state_cod: '001', // PENDIENTE
      });
      try {
        await trx.getRepository(User).save(user);
      } catch (e: any) {
        if (e?.code === '23505')
          throw new ConflictException('Email o SSC duplicado');
        throw e;
      }

      // 2) rol Cliente
      await trx.getRepository(UserRole).save({
        user_id: user.id,
        role_tab: 'ROL',
        role_cod: '003', // Cliente
      });

      // 3) perfil
      const prof = trx.getRepository(ClientProfile).create({
        user_id: user.id,
        first_name: dto.firstName,
        last_name: dto.lastName,
        address: dto.address ?? null,
        birth_date: dto.birthDate ?? null,

        gender_tab: 'GEN',
        gender_cod: dto.gender?.cod ?? null,
        occupation_tab: 'OCU',
        occupation_cod: dto.occupation?.cod ?? null,
        country_tab: 'PAI',
        country_cod: dto.country?.cod ?? null,
        province_tab: 'REG',
        province_cod: dto.province?.cod ?? null,
        municipality_tab: 'MUN',
        municipality_cod: dto.municipality?.cod ?? null,

        alt_contact_name: dto.altContactName ?? null,
        alt_contact_phone_e164: dto.altContactPhone ?? null,
      });
      await trx.getRepository(ClientProfile).save(prof);

      // 4) documentos
      if (dto.documents?.length) {
        const docs = dto.documents.map((d) =>
          trx.getRepository(UserDocument).create({
            user_id: user.id,
            doc_tab: d.tab,
            doc_cod: d.cod,
            storage_path: d.storagePath,
            filename: d.filename ?? null,
            mime_type: d.mimeType ?? null,
            size_bytes: d.sizeBytes ?? null,
            status: null,
            notes: null,
          }),
        );
        await trx.getRepository(UserDocument).save(docs);
      }

      // 5) respuesta (detalle)
      return await this.getOne(user.id);
    });
  }

  async getOne(userId: string) {
    const u = await this.usersRepo.findOne({ where: { id: userId } });
    if (!u) throw new NotFoundException('Usuario no encontrado');

    const prof = await this.clientRepo.findOne({ where: { user_id: userId } });
    if (!prof) throw new NotFoundException('Perfil de cliente no encontrado');

    const [est, roles, docs, gen, ocu, pai, reg, mun] = await Promise.all([
      this.tiposRepo.findOne({
        where: {
          tab_tabla: u.account_state_tab,
          cod_tipo: u.account_state_cod,
        },
      }),
      this.rolesRepo
        .createQueryBuilder('ur')
        .innerJoin(
          Tipo,
          't',
          't.tab_tabla = ur.role_tab AND t.cod_tipo = ur.role_cod',
        )
        .select([
          'ur.role_tab AS tab',
          'ur.role_cod AS cod',
          't.des_tipo AS desc',
        ])
        .where('ur.user_id = :id', { id: userId })
        .andWhere(`ur.role_tab='ROL'`)
        .orderBy('cod', 'ASC')
        .getRawMany(),
      this.docRepo.find({ where: { user_id: userId } }),
      prof.gender_cod
        ? this.tiposRepo.findOne({
            where: { tab_tabla: 'GEN', cod_tipo: prof.gender_cod },
          })
        : null,
      prof.occupation_cod
        ? this.tiposRepo.findOne({
            where: { tab_tabla: 'OCU', cod_tipo: prof.occupation_cod },
          })
        : null,
      prof.country_cod
        ? this.tiposRepo.findOne({
            where: { tab_tabla: 'PAI', cod_tipo: prof.country_cod },
          })
        : null,
      prof.province_cod
        ? this.tiposRepo.findOne({
            where: { tab_tabla: 'REG', cod_tipo: prof.province_cod },
          })
        : null,
      prof.municipality_cod
        ? this.tiposRepo.findOne({
            where: { tab_tabla: 'MUN', cod_tipo: prof.municipality_cod },
          })
        : null,
    ]);

    return {
      userId,
      fullName: u.full_name,
      email: u.email,
      phone: u.phone_e164 ?? null,
      socialSecurity: u.social_security_code,
      accountState: {
        tab: 'EST',
        cod: u.account_state_cod,
        desc: est?.des_tipo ?? '',
      },
      roles,
      firstName: prof.first_name,
      lastName: prof.last_name,
      address: prof.address,
      birthDate: prof.birth_date,
      gender: gen
        ? { tab: 'GEN', cod: prof.gender_cod, desc: gen.des_tipo }
        : null,
      occupation: ocu
        ? { tab: 'OCU', cod: prof.occupation_cod, desc: ocu.des_tipo }
        : null,
      country: pai
        ? { tab: 'PAI', cod: prof.country_cod, desc: pai.des_tipo }
        : null,
      province: reg
        ? { tab: 'REG', cod: prof.province_cod, desc: reg.des_tipo }
        : null,
      municipality: mun
        ? { tab: 'MUN', cod: prof.municipality_cod, desc: mun.des_tipo }
        : null,
      altContactName: prof.alt_contact_name,
      altContactPhone: prof.alt_contact_phone_e164,
      documents: docs.map((d) => ({
        id: d.id,
        tab: d.doc_tab,
        cod: d.doc_cod,
        storagePath: d.storage_path,
      })),
    };
  }

  async patch(userId: string, body: PatchClientDto) {
    const prof = await this.clientRepo.findOne({ where: { user_id: userId } });
    if (!prof) throw new NotFoundException('Perfil de cliente no encontrado');

    // Validar tipos si vienen
    const check = async (tab: string, cod?: string) => {
      if (cod) await this.assertTipoExists(tab, cod);
    };
    await check('GEN', body.gender?.cod);
    await check('OCU', body.occupation?.cod);
    await check('PAI', body.country?.cod);
    await check('REG', body.province?.cod);
    await check('MUN', body.municipality?.cod);

    // Aplicar parches
    const set = (k: keyof ClientProfile, v: any) => {
      (prof as any)[k] = v as never;
    };
    if (body.firstName !== undefined) set('first_name', body.firstName);
    if (body.lastName !== undefined) set('last_name', body.lastName);
    if (body.address !== undefined) set('address', body.address ?? null);
    if (body.birthDate !== undefined) set('birth_date', body.birthDate ?? null);

    if (body.gender) {
      set('gender_tab', 'GEN');
      set('gender_cod', body.gender.cod ?? null);
    }
    if (body.occupation) {
      set('occupation_tab', 'OCU');
      set('occupation_cod', body.occupation.cod ?? null);
    }
    if (body.country) {
      set('country_tab', 'PAI');
      set('country_cod', body.country.cod ?? null);
    }
    if (body.province) {
      set('province_tab', 'REG');
      set('province_cod', body.province.cod ?? null);
    }
    if (body.municipality) {
      set('municipality_tab', 'MUN');
      set('municipality_cod', body.municipality.cod ?? null);
    }

    if (body.altContactName !== undefined)
      set('alt_contact_name', body.altContactName ?? null);
    if (body.altContactPhone !== undefined)
      set('alt_contact_phone_e164', body.altContactPhone ?? null);

    await this.clientRepo.save(prof);
    return this.getOne(userId);
  }
}
