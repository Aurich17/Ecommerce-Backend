// src/roles/roles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
// import { CreateRoleDto } from './dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly repo: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    // Si quieres solo activos: return this.repo.find({ where: { activo: true } });
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const role = this.repo.create({
      ...dto,
      // si no viene, TypeORM pondrá CURRENT_DATE y activo=true por defecto
    });
    return this.repo.save(role);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Rol con id ${id} no existe`);
    }
  }
}
