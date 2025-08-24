import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from './entities/currency.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Currencies')
@Controller('currencies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva moneda' })
  @ApiResponse({
    status: 201,
    description: 'Moneda creada exitosamente',
    type: Currency,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las monedas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de monedas',
    type: [Currency],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Boolean,
    description: 'Filtrar por estado',
  })
  findAll(@Query('status') status?: string): Promise<Currency[]> {
    if (status !== undefined) {
      const statusBoolean = status === 'true';
      return this.currenciesService.findByStatus(statusBoolean);
    }
    return this.currenciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una moneda por ID' })
  @ApiResponse({
    status: 200,
    description: 'Moneda encontrada',
    type: Currency,
  })
  @ApiResponse({ status: 404, description: 'Moneda no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Currency> {
    return this.currenciesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una moneda' })
  @ApiResponse({
    status: 200,
    description: 'Moneda actualizada exitosamente',
    type: Currency,
  })
  @ApiResponse({ status: 404, description: 'Moneda no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    return this.currenciesService.update(id, updateCurrencyDto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Cambiar el estado de una moneda' })
  @ApiResponse({
    status: 200,
    description: 'Estado cambiado exitosamente',
    type: Currency,
  })
  @ApiResponse({ status: 404, description: 'Moneda no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<Currency> {
    return this.currenciesService.toggleStatus(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una moneda' })
  @ApiResponse({ status: 200, description: 'Moneda eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Moneda no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.currenciesService.remove(id);
  }
}
