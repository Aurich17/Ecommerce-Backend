import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { HowItWorksService } from '../services/howitworks.service';
import { PagingQueryDto } from '../dto/paging.dto';
import {
  CreateHowItWorksDto,
  UpdateHowItWorksDto,
} from '../dto/howitworks.dto';

@ApiTags('Landing - How It Works')
@Controller('landing/how-it-works')
export class HowItWorksController {
  constructor(private readonly service: HowItWorksService) {}

  @Get()
  @ApiOperation({ summary: 'Listar pasos' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'enabled', required: false })
  @ApiOkResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async list(@Query() q: PagingQueryDto) {
    const data = await this.service.list(q);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener paso' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse()
  async getOne(@Param('id') id: string) {
    const data = await this.service.getOne(Number(id));
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: 'Crear paso' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateHowItWorksDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar paso' })
  @ApiOkResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(@Param('id') id: string, @Body() dto: UpdateHowItWorksDto) {
    const data = await this.service.patch(Number(id), dto);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar paso' })
  @ApiOkResponse()
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id));
    return { success: true, data: true };
  }
}
