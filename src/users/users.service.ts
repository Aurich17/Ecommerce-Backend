import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Rol } from './entities/rol.entity';

import { ClientProfile } from '../clients/entities/client-profile.entity';
import { UserDocument } from '../clients/entities/user-document.entity';
import { CompanyDocument } from '../companies/entities/company-document.entity';
import { Tipo } from './entities/tipo.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,

    // 👇 ahora también inyectamos el perfil de cliente
    @InjectRepository(ClientProfile)
    private clientRepo: Repository<ClientProfile>,
    @InjectRepository(Tipo) private tiposRepo: Repository<Tipo>,
    @InjectRepository(UserDocument)
    private userDocRepo: Repository<UserDocument>,

    @InjectRepository(CompanyDocument)
    private companyDocRepo: Repository<CompanyDocument>,
  ) {}

  async listUsers() {
    const rows = await this.usersRepo
      .createQueryBuilder('u')
      .leftJoin('rol', 'r', 'r.id = u.id_rol')
      .leftJoin(
        Tipo,
        't',
        't.tab_tabla = u.account_state_tab AND t.cod_tipo = u.account_state_cod',
      )
      .select([
        'u.id AS id',
        'u.full_name AS name',
        'u.email AS email',
        'u.social_security_code AS social',
        'COALESCE(t.des_tipo, u.status) AS status', // ← ahora desde e_tipos
        'r.description AS role',
      ])
      // si quieres solo filas con rol activo, deja esta línea;
      // si no, quítala:
      .where('r.activo = true')
      .getRawMany();

    return rows.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      social: u.social,
      status: u.status, // ya trae 'PENDIENTE'/'APROBADO'/'RECHAZADO'
      role: u.role || 'Sin rol',
    }));
  }

  // ========== DOCUMENTOS ==========
  async getUserDocuments(userId: string, userType: 'cliente' | 'empresa') {
    if (userType === 'cliente') {
      const docs = await this.userDocRepo.find({ where: { user_id: userId } });
      return docs.map((d) => ({
        selfie_url: d.selfie_url,
        dni_reverso_url: d.dni_reverso_url,
      }));
    } else {
      const docs = await this.companyDocRepo.find({
        where: { user_id: userId },
      });
      return docs.map((d) => ({ doc_url: d.doc_url }));
    }
  }

  async getUserSummary(userId: string) {
    const u = await this.usersRepo
      .createQueryBuilder('u')
      .leftJoin('rol', 'r', 'r.id = u.id_rol')
      .leftJoin(
        'e_tipos',
        't',
        't.tab_tabla = u.account_state_tab AND t.cod_tipo = u.account_state_cod',
      )
      .select([
        'u.id AS id',
        'u.full_name AS name',
        'u.email AS email',
        'u.social_security_code AS social',
        'u.account_state_tab AS est_tab',
        'u.account_state_cod AS est_cod',
        "COALESCE(t.des_tipo,'') AS est_desc",
        "COALESCE(r.description,'') AS role",
      ])
      .where('u.id = :userId', { userId })
      .getRawOne();

    if (!u) return null;

    const roleNorm = String(u.role || '').toLowerCase();

    let documents: Array<{ type: string; url: string }> = [];

    if (roleNorm === 'empresa') {
      const docs = await this.companyDocRepo.find({
        where: { user_id: userId },
      });
      documents = docs.map((d) => ({ type: 'company_doc', url: d.doc_url }));
    } else {
      const cliDocs = await this.userDocRepo.find({
        where: { user_id: userId },
      });
      documents = (cliDocs ?? []).flatMap((d) => {
        const out: Array<{ type: string; url: string }> = [];
        if (d.selfie_url) out.push({ type: 'selfie', url: d.selfie_url });
        if (d.dni_reverso_url)
          out.push({ type: 'dni_reverso', url: d.dni_reverso_url });
        return out;
      });
    }

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      social: u.social,
      role: u.role,
      status: u.est_cod, // 👈 añade este campo (o usa est_desc si prefieres el texto)
      accountState: { tab: u.est_tab, cod: u.est_cod, desc: u.est_desc },
      documents,
    };
  }

  async updateUserStatus(userId: string, statusCod: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Validar que exista el código en e_tipos para la tabla EST
    const exists = await this.tiposRepo.exist({
      where: { tab_tabla: 'EST', cod_tipo: statusCod },
    });
    if (!exists) throw new BadRequestException('Código de estado inválido');

    await this.usersRepo.update(
      { id: userId },
      {
        account_state_tab: 'EST',
        account_state_cod: statusCod,
        updated_at: () => 'now()',
      },
    );

    return { id: userId, accountState: { tab: 'EST', cod: statusCod } };
  }
}
