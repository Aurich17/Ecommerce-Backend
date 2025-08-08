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
import { CiudadesService } from './ciudades.service';
import { Ciudad } from './ciudad.entity';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('ciudades')
@Controller('ciudades')
export class CiudadesController {
  constructor(private readonly servicio: CiudadesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva ciudad' })
  @ApiBody({ type: CreateCiudadDto })
  @ApiResponse({ status: 201, description: 'Ciudad creada', type: Ciudad })
  create(@Body() dto: CreateCiudadDto): Promise<Ciudad> {
    return this.servicio.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ciudades' })
  @ApiResponse({
    status: 200,
    description: 'Listado de ciudades',
    type: [Ciudad],
  })
  findAll(): Promise<Ciudad[]> {
    return this.servicio.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ciudad por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la ciudad' })
  @ApiResponse({ status: 200, description: 'Ciudad encontrada', type: Ciudad })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Ciudad> {
    return this.servicio.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una ciudad' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la ciudad' })
  @ApiBody({ type: UpdateCiudadDto })
  @ApiResponse({ status: 200, description: 'Ciudad actualizada', type: Ciudad })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCiudadDto,
  ): Promise<Ciudad> {
    return this.servicio.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una ciudad' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la ciudad' })
  @ApiResponse({ status: 204, description: 'Ciudad eliminada' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.servicio.remove(id);
  }
}
