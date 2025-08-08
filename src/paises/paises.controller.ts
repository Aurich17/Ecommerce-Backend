import { Controller, Get } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { Pais } from './pais.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('paises')
@Controller('paises')
export class PaisesController {
  constructor(private readonly paisesService: PaisesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de todos los países' })
  @ApiResponse({ status: 200, description: 'Listado de países', type: [Pais] })
  getAll(): Promise<Pais[]> {
    return this.paisesService.findAll();
  }
}
