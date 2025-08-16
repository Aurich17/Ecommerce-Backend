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
import { CompanyProfile } from './entities/company-profile.entity';
import { CompanyDocument } from './entities/company-document.entity';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { PatchCompanyDto } from './dto/patch-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly ds: DataSource,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(UserRole) private rolesRepo: Repository<UserRole>,
    @InjectRepository(Tipo) private tiposRepo: Repository<Tipo>,
    @InjectRepository(CompanyProfile)
    private companyRepo: Repository<CompanyProfile>,
    @InjectRepository(CompanyDocument)
    private docRepo: Repository<CompanyDocument>,
  ) {}

  // --- helpers (mismo algoritmo que clientes) ---
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
  private async assertTipo(tab: string, cod: string) {
    const ok = await this.tiposRepo.findOne({
      where: { tab_tabla: tab, cod_tipo: cod },
      select: ['id'],
    });
    if (!ok) throw new BadRequestException(`Tipo inexistente (${tab}:${cod})`);
  }

  // --- API ---
  async register(dto: RegisterCompanyDto) {
    // Validaciones de tipos requeridos
    await this.assertTipo('NEG', dto.businessType.cod);
    await this.assertTipo('PAI', dto.country.cod);
    await this.assertTipo('REG', dto.province.cod);
    await this.assertTipo('MUN', dto.municipality.cod);

    return await this.ds.transaction(async (trx) => {
      // 1) user representante
      const ssc = await this.generateUniqueSSC(dto.fullName);
      const user = trx.getRepository(User).create({
        email: dto.email,
        password_hash: dto.password, // TODO: hash real
        full_name: dto.fullName,
        phone_e164: dto.phone ?? null,
        social_security_code: ssc,
        account_state_tab: 'EST',
        account_state_cod: '001', // Pendiente
      });
      try {
        await trx.getRepository(User).save(user);
      } catch (e: any) {
        if (e?.code === '23505')
          throw new ConflictException('Email o SSC duplicado');
        throw e;
      }

      // 2) rol Empresa
      await trx.getRepository(UserRole).save({
        user_id: user.id,
        role_tab: 'ROL',
        role_cod: '002', // Empresa
      });

      // 3) perfil empresa
      const prof = trx.getRepository(CompanyProfile).create({
        user_id: user.id,
        company_name: dto.companyName,

        business_type_tab: 'NEG',
        business_type_cod: dto.businessType.cod,

        country_tab: 'PAI',
        country_cod: dto.country.cod,
        province_tab: 'REG',
        province_cod: dto.province.cod,
        municipality_tab: 'MUN',
        municipality_cod: dto.municipality.cod,

        founded_on: dto.foundedOn ?? null,
        employee_count: dto.employeeCount ?? null,

        fiscal_address: dto.fiscalAddress ?? null,
        city: dto.city ?? null,
        postal_code: dto.postalCode ?? null,
        website: dto.website ?? null,
      });
      await trx.getRepository(CompanyProfile).save(prof);

      // 4) documentos
      if (dto.documents?.length) {
        const docs = dto.documents.map((d) =>
          trx.getRepository(CompanyDocument).create({
            user_id: user.id,
            doc_tab: d.tab,
            doc_cod: d.cod,
            storage_path: d.storagePath,
            filename: d.filename ?? null,
            mime_type: d.mimeType ?? null,
            size_bytes: d.sizeBytes ?? null,
          }),
        );
        await trx.getRepository(CompanyDocument).save(docs);
      }

      return await this.getOne(user.id);
    });
  }

  async getOne(userId: string) {
    const u = await this.usersRepo.findOne({ where: { id: userId } });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    const prof = await this.companyRepo.findOne({ where: { user_id: userId } });
    if (!prof) throw new NotFoundException('Perfil de empresa no encontrado');

    const [est, roles, docs, neg, pai, reg, mun] = await Promise.all([
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
      prof.business_type_cod
        ? this.tiposRepo.findOne({
            where: { tab_tabla: 'NEG', cod_tipo: prof.business_type_cod },
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
      companyName: prof.company_name,
      businessType: neg
        ? { tab: 'NEG', cod: prof.business_type_cod, desc: neg.des_tipo }
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
      foundedOn: prof.founded_on,
      employeeCount: prof.employee_count,
      fiscalAddress: prof.fiscal_address,
      city: prof.city,
      postalCode: prof.postal_code,
      website: prof.website,
      documents: docs.map((d) => ({
        id: d.id,
        tab: d.doc_tab,
        cod: d.doc_cod,
        storagePath: d.storage_path,
      })),
    };
  }

  async patch(userId: string, body: PatchCompanyDto) {
    const prof = await this.companyRepo.findOne({ where: { user_id: userId } });
    if (!prof) throw new NotFoundException('Perfil de empresa no encontrado');

    // Validar tipos si vienen
    const check = async (tab: string, cod?: string) => {
      if (cod) await this.assertTipo(tab, cod);
    };
    await check('NEG', body.businessType?.cod);
    await check('PAI', body.country?.cod);
    await check('REG', body.province?.cod);
    await check('MUN', body.municipality?.cod);

    const set = (k: keyof CompanyProfile, v: any) => {
      (prof as any)[k] = v as never;
    };

    if (body.companyName !== undefined) set('company_name', body.companyName);

    if (body.businessType) {
      set('business_type_tab', 'NEG');
      set('business_type_cod', body.businessType.cod ?? null);
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

    if (body.foundedOn !== undefined) set('founded_on', body.foundedOn ?? null);
    if (body.employeeCount !== undefined)
      set('employee_count', body.employeeCount ?? null);

    if (body.fiscalAddress !== undefined)
      set('fiscal_address', body.fiscalAddress ?? null);
    if (body.city !== undefined) set('city', body.city ?? null);
    if (body.postalCode !== undefined)
      set('postal_code', body.postalCode ?? null);
    if (body.website !== undefined) set('website', body.website ?? null);

    await this.companyRepo.save(prof);
    return this.getOne(userId);
  }
}
