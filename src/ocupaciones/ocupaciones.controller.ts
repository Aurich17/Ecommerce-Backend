// src/ocupaciones/ocupaciones.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OcupacionesService } from './ocupaciones.services';
import { Ocupaciones } from './ocupaciones.entity';

@ApiTags('ocupaciones')
@Controller('ocupaciones')
export class OcupacionesController {
  constructor(private readonly service: OcupacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ocupaciones' })
  @ApiResponse({
    status: 200,
    description: 'Listado de ocupaciones',
    type: [Ocupaciones],
  })
  findAll(): Promise<Ocupaciones[]> {
    return this.service.findAll();
  }
}
