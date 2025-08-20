import {
  Controller,
  Get,
  Put,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LandingEncabezadoService } from './landing-encabezado.service';
import { UpdateLandingEncabezadoDto } from './dto/update-landing-encabezado.dto';

@ApiTags('landing')
@ApiBearerAuth()
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('landing/encabezado')
export class LandingEncabezadoController {
  constructor(private readonly service: LandingEncabezadoService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener contenido del encabezado' })
  async get() {
    return this.service.get();
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar contenido del encabezado' })
  @ApiBody({ type: UpdateLandingEncabezadoDto })
  @ApiResponse({ status: 200, description: 'Contenido actualizado' })
  async update(@Body() dto: UpdateLandingEncabezadoDto) {
    return this.service.update(dto);
  }
}
