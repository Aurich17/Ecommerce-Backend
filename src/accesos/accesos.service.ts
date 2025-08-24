// src/accesos/accesos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Acceso } from './entities/acceso.entity';
import {
  UpdateAccesoDto,
  MenuResponseDto,
  MenuWithPermissionsDto,
  BulkUpdatePermissionsDto,
  CreateAccesoDto,
} from './dto';

@Injectable()
export class AccesosService {
  constructor(
    @InjectRepository(Acceso)
    private readonly repo: Repository<Acceso>,
    private readonly dataSource: DataSource,
  ) {}

  findByRol(idRol: number): Promise<Acceso[]> {
    return this.repo.find({
      where: { idRol },
      order: { idMenu: 'ASC' },
    });
  }

  // Actualiza por ID (fila específica)
  async updateById(id: number, dto: UpdateAccesoDto): Promise<Acceso> {
    const preload = await this.repo.preload({ id, ...dto });
    if (!preload) throw new NotFoundException(`Acceso id ${id} no existe`);
    return this.repo.save(preload);
  }

  // (Opcional) actualizar por (idRol, idMenu)
  async updateByRolMenu(
    idRol: number,
    idMenu: number,
    dto: UpdateAccesoDto,
  ): Promise<Acceso> {
    const row = await this.repo.findOne({ where: { idRol, idMenu } });
    if (!row) {
      throw new NotFoundException(
        `Acceso rol ${idRol} / menú ${idMenu} no existe`,
      );
    }
    Object.assign(row, dto);
    return this.repo.save(row);
  }

  // Obtener todos los menús disponibles
  async getAllMenus(): Promise<MenuResponseDto[]> {
    const query = `
      SELECT 
        id,
        descripcion,
        icono,
        COALESCE("isSubmenu", false) as "isSubmenu",
        NULLIF(idpadre, 0) as idpadre,
        url,
        COALESCE(activo, true) as activo
      FROM public.menu
      WHERE COALESCE(activo, true) = true
      ORDER BY COALESCE(idpadre, 0), id
    `;

    const flatMenus = await this.dataSource.query(query);
    return this.buildMenuHierarchy(flatMenus);
  }

  private buildMenuHierarchy(flatMenus: any[]): MenuResponseDto[] {
    const menuMap = new Map<number, MenuResponseDto>();
    const rootMenus: MenuResponseDto[] = [];

    // Crear mapa de menús
    flatMenus.forEach((menu) => {
      menuMap.set(menu.id, {
        ...menu,
        children: [],
      });
    });

    // Construir jerarquía
    flatMenus.forEach((menu) => {
      const menuItem = menuMap.get(menu.id);
      if (menu.idpadre && menuMap.has(menu.idpadre)) {
        const parent = menuMap.get(menu.idpadre);
        parent.children.push(menuItem);
      } else {
        rootMenus.push(menuItem);
      }
    });

    return rootMenus;
  }

  // Obtener menús con permisos para un rol específico
  async getMenusWithPermissions(
    idRol: number,
  ): Promise<MenuWithPermissionsDto[]> {
    const query = `
      SELECT 
        m.id,
        m.descripcion,
        m.icono,
        COALESCE(m."isSubmenu", false) as "isSubmenu",
        NULLIF(m.idpadre, 0) as idpadre,
        m.url,
        COALESCE(m.activo, true) as activo,
        a.id as "accesoId",
        COALESCE(a.activo, false) as "permisoActivo",
        COALESCE(a.add_register, false) as "addRegister",
        COALESCE(a.edit_register, false) as "editRegister",
        COALESCE(a.delete_register, false) as "deleteRegister"
      FROM public.menu m
      INNER JOIN public.acceso a ON a.id_menu = m.id AND a.id_rol = $1
      WHERE COALESCE(m.activo, true) = true AND COALESCE(a.activo, false) = true
      ORDER BY COALESCE(m.idpadre, 0), m.id
    `;

    const results = await this.dataSource.query(query, [idRol]);

    const flatMenusWithPermissions = results.map((row) => ({
      id: row.id,
      descripcion: row.descripcion,
      icono: row.icono,
      isSubmenu: row.isSubmenu,
      idpadre: row.idpadre,
      url: row.url,
      activo: row.activo,
      permisos: row.accesoId
        ? {
            accesoId: row.accesoId,
            activo: row.permisoActivo,
            addRegister: row.addRegister,
            editRegister: row.editRegister,
            deleteRegister: row.deleteRegister,
          }
        : null,
    }));

    return this.buildMenuWithPermissionsHierarchy(flatMenusWithPermissions);
  }

  private buildMenuWithPermissionsHierarchy(
    flatMenus: any[],
  ): MenuWithPermissionsDto[] {
    const menuMap = new Map<number, MenuWithPermissionsDto>();
    const rootMenus: MenuWithPermissionsDto[] = [];

    // Crear mapa de menús
    flatMenus.forEach((menu) => {
      menuMap.set(menu.id, {
        ...menu,
        children: [],
      });
    });

    // Construir jerarquía
    flatMenus.forEach((menu) => {
      const menuItem = menuMap.get(menu.id);
      if (menu.idpadre && menuMap.has(menu.idpadre)) {
        const parent = menuMap.get(menu.idpadre);
        parent.children.push(menuItem);
      } else {
        rootMenus.push(menuItem);
      }
    });

    return rootMenus;
  }

  // Actualizar permisos masivos para un rol
  async bulkUpdatePermissions(
    idRol: number,
    dto: BulkUpdatePermissionsDto,
  ): Promise<{ updated: number; created: number }> {
    let updated = 0;
    let created = 0;

    for (const permiso of dto.permisos) {
      const existingAcceso = await this.repo.findOne({
        where: { idRol, idMenu: permiso.idMenu },
      });

      if (existingAcceso) {
        // Actualizar acceso existente
        Object.assign(existingAcceso, {
          activo: permiso.activo ?? existingAcceso.activo,
          addRegister: permiso.addRegister ?? existingAcceso.addRegister,
          editRegister: permiso.editRegister ?? existingAcceso.editRegister,
          deleteRegister:
            permiso.deleteRegister ?? existingAcceso.deleteRegister,
        });
        await this.repo.save(existingAcceso);
        updated++;
      } else {
        // Crear nuevo acceso
        const newAcceso = this.repo.create({
          idRol,
          idMenu: permiso.idMenu,
          activo: permiso.activo ?? true,
          addRegister: permiso.addRegister ?? false,
          editRegister: permiso.editRegister ?? false,
          deleteRegister: permiso.deleteRegister ?? false,
        });
        await this.repo.save(newAcceso);
        created++;
      }
    }

    return { updated, created };
  }

  // Crear nuevo acceso
  async createAcceso(dto: CreateAccesoDto): Promise<Acceso> {
    const existingAcceso = await this.repo.findOne({
      where: { idRol: dto.idRol, idMenu: dto.idMenu },
    });

    if (existingAcceso) {
      throw new NotFoundException(
        `Ya existe un acceso para el rol ${dto.idRol} y menú ${dto.idMenu}`,
      );
    }

    const newAcceso = this.repo.create(dto);
    return this.repo.save(newAcceso);
  }
}
