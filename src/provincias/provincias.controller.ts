import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProvinciasService } from './provincias.service';
import { Provincia } from './provincia.entity';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { UpdateProvinciaDto } from './dto/update-provincia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('provincias')
@Controller('provincias')
export class ProvinciasController {
  constructor(private readonly servicio: ProvinciasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva provincia' })
  @ApiBody({ type: CreateProvinciaDto })
  @ApiResponse({
    status: 201,
    description: 'Provincia creada',
    type: Provincia,
  })
  create(@Body() dto: CreateProvinciaDto): Promise<Provincia> {
    return this.servicio.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las provincias' })
  @ApiResponse({
    status: 200,
    description: 'Listado de provincias',
    type: [Provincia],
  })
  findAll(): Promise<Provincia[]> {
    return this.servicio.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una provincia por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la provincia' })
  @ApiResponse({
    status: 200,
    description: 'Provincia encontrada',
    type: Provincia,
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Provincia> {
    return this.servicio.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una provincia' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la provincia' })
  @ApiBody({ type: UpdateProvinciaDto })
  @ApiResponse({
    status: 200,
    description: 'Provincia actualizada',
    type: Provincia,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProvinciaDto,
  ): Promise<Provincia> {
    return this.servicio.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una provincia' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la provincia' })
  @ApiResponse({ status: 204, description: 'Provincia eliminada' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.servicio.remove(id);
  }
}
