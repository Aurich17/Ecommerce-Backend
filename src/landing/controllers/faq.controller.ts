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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FaqService } from '../services/faq.service';
import { PagingQueryDto } from '../dto/paging.dto';
import { CreateFaqDto, UpdateFaqDto } from '../dto/faq.dto';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Landing - FAQ')
@Controller('landing/faq')
export class FaqController {
  constructor(private readonly service: FaqService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar preguntas frecuentes' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'activo', required: false })
  @ApiOkResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async list(@Query() q: PagingQueryDto) {
    const data = await this.service.list(q);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener FAQ' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse()
  async getOne(@Param('id') id: string) {
    const data = await this.service.getOne(Number(id));
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: 'Crear FAQ' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateFaqDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar FAQ' })
  @ApiOkResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    const data = await this.service.patch(Number(id), dto);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar FAQ' })
  @ApiOkResponse()
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id));
    return { success: true, data: true };
  }
}
