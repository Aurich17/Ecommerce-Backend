// src/accesos/accesos.controller.ts
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { AccesosService } from './accesos.service';
import { UpdateAccesoDto } from './dto/update-acceso.dto';
import { Public } from 'src/auth/public.decorator';
// import { UpdateAccesoDto } from './dto/update-acceso.dto';

@Public()
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
  updateByRolMenu(
    @Param('idRol', ParseIntPipe) idRol: number,
    @Param('idMenu', ParseIntPipe) idMenu: number,
    @Body() dto: UpdateAccesoDto,
  ) {
    return this.service.updateByRolMenu(idRol, idMenu, dto);
  }
}
