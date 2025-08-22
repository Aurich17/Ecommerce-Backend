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
import { FeaturesService } from '../services/features.service';
import { PagingQueryDto } from '../dto/paging.dto';
import { CreateFeatureDto, UpdateFeatureDto } from '../dto/feature.dto';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Landing - Features')
@Controller('landing/features')
export class FeaturesController {
  constructor(private readonly service: FeaturesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar características' })
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
  @ApiOperation({ summary: 'Obtener característica' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse()
  async getOne(@Param('id') id: string) {
    const data = await this.service.getOne(Number(id));
    return { success: true, data };
  }
@Public()
  @Post()
  @ApiOperation({ summary: 'Crear característica' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateFeatureDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }
@Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar característica' })
  @ApiOkResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(@Param('id') id: string, @Body() dto: UpdateFeatureDto) {
    const data = await this.service.patch(Number(id), dto);
    return { success: true, data };
  }
@Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar característica' })
  @ApiOkResponse()
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id));
    return { success: true, data: true };
  }
}
