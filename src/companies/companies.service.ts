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
import { PatchCompanyDto } from './dto/patch-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly dataSource: DataSource,
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
    // Cambiar para generar códigos de 4 caracteres como los existentes
    return (a + b + c + d).substring(0, 4).padEnd(4, 'X');
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
      // Cambiar el formato para que coincida con los existentes: XXXX-XXX-XXX
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

  // Función helper para mapear códigos de país alfabéticos a numéricos
  private mapCountryCode(countryCode: string | undefined): string {
    if (!countryCode) return '001'; // Default

    // Mapeo de códigos alfabéticos a numéricos
    const countryMap: Record<string, string> = {
      COL: '001', // Colombia
      PER: '002', // Perú
      ECU: '003', // Ecuador
      VEN: '004', // Venezuela
      ARG: '005', // Argentina
      CHL: '006', // Chile
      BOL: '007', // Bolivia
      BRA: '008', // Brasil
      URY: '009', // Uruguay
      PRY: '010', // Paraguay
      // Agregar más países según necesites
    };

    return countryMap[countryCode.toUpperCase()] || '001';
  }

  // Función similar para provincias
  private mapProvinceCode(provinceCode: string | undefined): string {
    if (!provinceCode) return '001';

    const provinceMap: Record<string, string> = {
      ANT: '001', // Antioquia
      BOG: '002', // Bogotá
      VAL: '003', // Valle del Cauca
      ATL: '004', // Atlántico
      SAN: '005', // Santander
      // Agregar más provincias según necesites
    };

    return provinceMap[provinceCode.toUpperCase()] || '001';
  }

  // Función similar para municipios
  private mapMunicipalityCode(municipalityCode: string | undefined): string {
    if (!municipalityCode) return '001';

    const municipalityMap: Record<string, string> = {
      MED: '001', // Medellín
      BOG: '002', // Bogotá
      CAL: '003', // Cali
      BAQ: '004', // Barranquilla
      BUC: '005', // Bucaramanga
      // Agregar más municipios según necesites
    };

    return municipalityMap[municipalityCode.toUpperCase()] || '001';
  }

  async registrarCompleto(dto: RegisterCompanyDto) {
    const pwd = dto.password?.trim();
    if (!pwd) throw new BadRequestException('password requerido');

    // normalizar RUC (sin espacios/guiones). Ajusta si necesitas reglas por país.
    const rucNorm = (dto.ruc || '').replace(/\s|-/g, '');

    const passwordHash = await bcrypt.hash(pwd, 10);
    // Generar el social_security_code usando el método existente
    const socialSecurityCode = await this.generateUniqueSSC(
      dto.company_name || '',
    );

    const q = `
WITH new_user AS (
  INSERT INTO public.users
    (id, email, password_hash, full_name, phone_e164, social_security_code, status, id_rol)
  VALUES (
    gen_random_uuid(),
    $12, $13,
    $1,                       -- full_name = razón social
    $2,
    $18,                      -- social_security_code generado
    'habilitado',
    COALESCE($16, 2)
  )
  RETURNING id, social_security_code
),
ins_profile AS (
  INSERT INTO public.company_profiles (
    user_id, company_name, ruc,
    business_type_tab, business_type_cod,
    country_tab, country_cod,
    province_tab, province_cod,
    municipality_tab, municipality_cod,
    founded_on, employee_count,
    fiscal_address, city, postal_code, website
  )
  SELECT
    u.id, $1, $7,
    'NEG', UPPER(TRIM($3)),  -- Cambiar 'BUS' por 'NEG'
    'PAI', UPPER(TRIM($4)),
    'REG', UPPER(TRIM($5)),
    'MUN', UPPER(TRIM($6)),
    NULLIF($8,'')::date,
    NULLIF($9::text,'')::int,
    NULLIF($10,''),
    NULLIF($11,''),
    NULLIF($14,''),
    NULLIF($15,'')
  FROM new_user u
),
ins_docs AS (
  INSERT INTO public.company_documents (id, user_id, doc_url)
  SELECT gen_random_uuid(), u.id, d.url
  FROM new_user u
  JOIN unnest(COALESCE($17::text[], ARRAY[]::text[])) AS d(url) ON TRUE
)
SELECT
  (SELECT id FROM new_user)                   AS user_id,
  (SELECT social_security_code FROM new_user) AS social_security_code;
`;

    // Y en los parámetros:
    const params = [
      dto.company_name ?? '', // $1
      dto.phone_e164 ?? null, // $2
      dto.business_type_cod ?? null, // $3
      this.mapCountryCode(dto.country_cod), // $4 - mapear código alfabético a numérico
      this.mapProvinceCode(dto.province_cod), // $5 - mapear código alfabético a numérico
      this.mapMunicipalityCode(dto.municipality_cod), // $6 - mapear código alfabético a numérico
      rucNorm, // $7
      dto.founded_on ?? null, // $8
      dto.employee_count ?? null, // $9
      dto.fiscal_address ?? null, // $10
      dto.city ?? null, // $11
      dto.email, // $12
      passwordHash, // $13
      dto.postal_code ?? null, // $14
      dto.website ?? null, // $15
      dto.role_id ?? 2, // $16
      dto.doc_urls ?? [], // $17
      socialSecurityCode, // $18
    ];

    try {
      const rows = await this.dataSource.query(q, params);
      const out = rows?.[0] || rows?.[rows.length - 1] || {};
      return {
        user_id: out.user_id,
        social_security: out.social_security_code,
      };
    } catch (err: any) {
      // email duplicado u otra clave única
      if (err?.code === '23505') {
        // si la violación proviene del índice único del RUC, puedes personalizar el mensaje:
        // if (String(err?.detail || '').toLowerCase().includes('company_profiles_ruc_uniq'))
        //   throw new ConflictException('El RUC ya está registrado');
        throw new ConflictException('El email o RUC ya está registrado');
      }
      throw err;
    }
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
        url: d.doc_url, // ✅ Usar el campo que realmente existe
      })),
    };
  }

  async list() {
    const query = this.ds
      .createQueryBuilder()
      .select([
        'cp.user_id AS userId',
        'cp.company_name AS companyName',
        'cp.business_type_tab AS businessTypeTab',
        'cp.business_type_cod AS businessTypeCod',
        'cp.country_tab AS countryTab',
        'cp.country_cod AS countryCod',
        'cp.province_tab AS provinceTab',
        'cp.province_cod AS provinceCod',
        'cp.municipality_tab AS municipalityTab',
        'cp.municipality_cod AS municipalityCod',
        'cp.founded_on AS foundedOn',
        'cp.employee_count AS employeeCount',
        'cp.fiscal_address AS fiscalAddress',
        'cp.city AS city',
        'cp.postal_code AS postalCode',
        'cp.website AS website',
        'cp.created_at AS createdAt',
        'cp.updated_at AS updatedAt',
        'u.email AS email',
        'u.phone_e164 AS phone',
      ])
      .from(CompanyProfile, 'cp')
      .leftJoin(User, 'u', 'u.id = cp.user_id')
      .orderBy('cp.created_at', 'DESC');

    const results = await query.getRawMany();

    return results.map((item) => ({
      userId: item.userid,
      companyName: item.companyname,
      businessType: {
        tab: item.businesstypetab,
        cod: item.businesstypecod,
      },
      country: {
        tab: item.countrytab,
        cod: item.countrycod,
      },
      province: {
        tab: item.provincetab,
        cod: item.provincecod,
      },
      municipality: {
        tab: item.municipalitytab,
        cod: item.municipalitycod,
      },
      foundedOn: item.foundedon,
      employeeCount: item.employeecount,
      fiscalAddress: item.fiscaladdress,
      city: item.city,
      postalCode: item.postalcode,
      website: item.website,
      createdAt: item.createdat,
      updatedAt: item.updatedat,
      contact: {
        email: item.email,
        phone: item.phone,
      },
    }));
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
