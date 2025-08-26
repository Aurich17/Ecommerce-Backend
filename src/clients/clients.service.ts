/* eslint-disable @typescript-eslint/no-unused-vars */
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

  private normalizeName(s: string) {
    return s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  private sscFromFullName(fullName: string): string {
    const normalized = this.normalizeName(fullName);
    const words = normalized.split(/\s+/).filter((w) => w.length > 0);

    if (words.length === 0) return 'XXX000';
    if (words.length === 1) {
      const w = words[0];
      if (w.length >= 3) return w.substring(0, 3) + '000';
      return w.padEnd(3, 'X') + '000';
    }

    const first = words[0];
    const last = words[words.length - 1];

    let prefix = '';
    if (first.length >= 2) prefix += first.substring(0, 2);
    else prefix += first.padEnd(2, 'X');

    if (last.length >= 1) prefix += last.substring(0, 1);
    else prefix += 'X';

    return prefix + '000';
  }

  private async generateUniqueSSC(fullName: string): Promise<string> {
    const base = this.sscFromFullName(fullName);
    const prefix = base.substring(0, 3);

    for (let i = 0; i <= 999; i++) {
      const candidate = prefix + i.toString().padStart(3, '0');
      const existing = await this.usersRepo.findOne({
        where: { social_security_code: candidate },
      });
      if (!existing) return candidate;
    }

    throw new Error('No se pudo generar un SSC único');
  }

  private async assertTipoExists(tab: string, cod: string) {
    const tipo = await this.tiposRepo.findOne({
      where: { tab_tabla: tab, cod_tipo: cod },
    });
    if (!tipo) throw new BadRequestException(`Tipo ${tab}:${cod} no existe`);
  }

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

      // 4) documentos - SOLUCIÓN CORRECTA
      if (dto.documents?.length) {
        // Mapear los documentos del DTO a los campos reales de UserDocument
        for (const d of dto.documents) {
          const userDoc = trx.getRepository(UserDocument).create({
            cliente_id: parseInt(user.id),
            // Mapear según el tipo de documento
            selfie_url:
              d.tab === 'DOC' && d.cod === '001' ? d.storagePath : null,
            dni_reverso_url:
              d.tab === 'DOC' && d.cod === '002' ? d.storagePath : null,
          });
          await trx.getRepository(UserDocument).save(userDoc);
        }
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
      // Buscar documentos por cliente_id
      this.docRepo.find({ where: { cliente_id: parseInt(userId) } }),
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
      // Mapear documentos de vuelta al formato esperado
      documents: docs
        .map((d) => {
          const documents = [];
          if (d.selfie_url) {
            documents.push({
              tab: 'DOC',
              cod: '001',
              storagePath: d.selfie_url,
            });
          }
          if (d.dni_reverso_url) {
            documents.push({
              tab: 'DOC',
              cod: '002',
              storagePath: d.dni_reverso_url,
            });
          }
          return documents;
        })
        .flat(),
    };
  }

  async patch(userId: string, body: PatchClientDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const prof = await this.clientRepo.findOne({ where: { user_id: userId } });
    if (!prof) throw new NotFoundException('Perfil no encontrado');

    const set = (field: keyof ClientProfile, value: any) => {
      if (value !== undefined) (prof as any)[field] = value;
    };

    // Actualizar campos del perfil - SOLO los que existen en PatchClientDto
    set('first_name', body.firstName);
    set('last_name', body.lastName);
    set('address', body.address);
    set('birth_date', body.birthDate);

    // Validar y actualizar combos
    if (body.gender !== undefined) {
      if (body.gender?.cod) await this.assertTipoExists('GEN', body.gender.cod);
      set('gender_tab', 'GEN');
      set('gender_cod', body.gender?.cod ?? null);
    }

    if (body.occupation !== undefined) {
      if (body.occupation?.cod)
        await this.assertTipoExists('OCU', body.occupation.cod);
      set('occupation_tab', 'OCU');
      set('occupation_cod', body.occupation?.cod ?? null);
    }

    if (body.country !== undefined) {
      if (body.country?.cod)
        await this.assertTipoExists('PAI', body.country.cod);
      set('country_tab', 'PAI');
      set('country_cod', body.country?.cod ?? null);
    }

    if (body.province !== undefined) {
      if (body.province?.cod)
        await this.assertTipoExists('REG', body.province.cod);
      set('province_tab', 'REG');
      set('province_cod', body.province?.cod ?? null);
    }

    if (body.municipality !== undefined) {
      if (body.municipality?.cod)
        await this.assertTipoExists('MUN', body.municipality.cod);
      set('municipality_tab', 'MUN');
      set('municipality_cod', body.municipality?.cod ?? null);
    }

    if (body.altContactName !== undefined)
      set('alt_contact_name', body.altContactName ?? null);
    if (body.altContactPhone !== undefined)
      set('alt_contact_phone_e164', body.altContactPhone ?? null);

    await this.clientRepo.save(prof);
    return this.getOne(userId);
  }
}
