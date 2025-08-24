// src/accesos/accesos.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AccesosService } from './accesos.service';
import {
  UpdateAccesoDto,
  MenuResponseDto,
  MenuWithPermissionsDto,
  BulkUpdatePermissionsDto,
  CreateAccesoDto,
} from './dto';
import { Public } from 'src/auth/public.decorator';

@Public()
@ApiTags('Accesos y Permisos')
@Controller('accesos')
export class AccesosController {
  constructor(private readonly service: AccesosService) {}

  // Listado por rol
  @Get('rol/:idRol')
  findByRol(@Param('idRol', ParseIntPipe) idRol: number) {
    return this.service.findByRol(idRol);
  }

  // Actualizar por ID
  @Patch(':id')
  updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccesoDto,
  ) {
    return this.service.updateById(id, dto);
  }

  // (Opcional) Actualizar por (idRol, idMenu)
  @Patch('rol/:idRol/menu/:idMenu')
  @ApiOperation({ summary: 'Actualizar permiso específico por rol y menú' })
  @ApiParam({ name: 'idRol', description: 'ID del rol' })
  @ApiParam({ name: 'idMenu', description: 'ID del menú' })
  updateByRolMenu(
    @Param('idRol', ParseIntPipe) idRol: number,
    @Param('idMenu', ParseIntPipe) idMenu: number,
    @Body() dto: UpdateAccesoDto,
  ) {
    return this.service.updateByRolMenu(idRol, idMenu, dto);
  }

  // Obtener todos los menús disponibles
  @Get('menus')
  @ApiOperation({ summary: 'Obtener todos los menús disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de menús',
    type: [MenuResponseDto],
  })
  getAllMenus(): Promise<MenuResponseDto[]> {
    return this.service.getAllMenus();
  }

  // Obtener menús con permisos para un rol específico
  @Get('rol/:idRol/menus-permisos')
  @ApiOperation({
    summary: 'Obtener menús con permisos para un rol específico',
  })
  @ApiParam({ name: 'idRol', description: 'ID del rol' })
  @ApiResponse({
    status: 200,
    description: 'Menús con permisos del rol',
    type: [MenuWithPermissionsDto],
  })
  getMenusWithPermissions(
    @Param('idRol', ParseIntPipe) idRol: number,
  ): Promise<MenuWithPermissionsDto[]> {
    return this.service.getMenusWithPermissions(idRol);
  }

  // Actualizar permisos masivos para un rol
  @Patch('rol/:idRol/permisos-masivos')
  @ApiOperation({ summary: 'Actualizar permisos masivos para un rol' })
  @ApiParam({ name: 'idRol', description: 'ID del rol' })
  @ApiResponse({
    status: 200,
    description: 'Resultado de la actualización masiva',
  })
  bulkUpdatePermissions(
    @Param('idRol', ParseIntPipe) idRol: number,
    @Body() dto: BulkUpdatePermissionsDto,
  ) {
    return this.service.bulkUpdatePermissions(idRol, dto);
  }

  // Crear nuevo acceso
  @Post()
  @ApiOperation({ summary: 'Crear nuevo acceso para un rol y menú' })
  @ApiResponse({ status: 201, description: 'Acceso creado exitosamente' })
  createAcceso(@Body() dto: CreateAccesoDto) {
    return this.service.createAcceso(dto);
  }
}
