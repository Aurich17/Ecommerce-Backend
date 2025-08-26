import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Rol } from './entities/rol.entity';
import { UserDocument } from '../clients/entities/user-document.entity';
import { CompanyDocument } from '../companies/entities/company-document.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
    @InjectRepository(UserDocument)
    private userDocRepo: Repository<UserDocument>,
    @InjectRepository(CompanyDocument)
    private companyDocRepo: Repository<CompanyDocument>,
  ) {}

  // API 1: Listar usuarios con nombre, status y rol
  async listUsers() {
    const users = await this.usersRepo
      .createQueryBuilder('u')
      .leftJoin('rol', 'r', 'r.id = u.id_rol')
      .select([
        'u.id AS id',
        'u.full_name AS name',
        'u.status AS status',
        'r.description AS role',
      ])
      .where('r.activo = true')
      .getRawMany();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      status: user.status,
      role: user.role || 'Sin rol',
    }));
  }

  // API 2: Listar documentos por tipo de usuario
  async getUserDocuments(userId: string, userType: 'cliente' | 'empresa') {
    if (userType === 'cliente') {
      const docs = await this.userDocRepo.find({
        where: { cliente_id: parseInt(userId) },
      });
      return docs.map((doc) => ({
        selfie_url: doc.selfie_url,
        dni_reverso_url: doc.dni_reverso_url,
      }));
    } else {
      const docs = await this.companyDocRepo.find({
        where: { user_id: userId },
      });
      return docs.map((doc) => ({
        doc_url: doc.doc_url,
      }));
    }
  }
}
