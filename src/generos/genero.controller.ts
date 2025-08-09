// src/generos/generos.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerosService } from './genero.services';
import { Genero } from './genero.entity';

@ApiTags('generos')
@Controller('generos')
export class GenerosController {
  constructor(private readonly service: GenerosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los géneros' })
  @ApiResponse({
    status: 200,
    description: 'Listado de géneros',
    type: [Genero],
  })
  findAll(): Promise<Genero[]> {
    return this.service.findAll();
  }
}
