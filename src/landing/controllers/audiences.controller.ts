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
import { AudiencesService } from '../services/audiences.service';
import { PagingQueryDto } from '../dto/paging.dto';
import { CreateAudienceDto, UpdateAudienceDto } from '../dto/audience.dto';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Landing - Audiences')
@Controller('landing/audiences')
export class AudiencesController {
  constructor(private readonly service: AudiencesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar audiencias' })
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
  @ApiOperation({ summary: 'Obtener audiencia' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse()
  async getOne(@Param('id') id: string) {
    const data = await this.service.getOne(Number(id));
    return { success: true, data };
  }
@Public()
  @Post()
  @ApiOperation({ summary: 'Crear audiencia' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateAudienceDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }
@Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar audiencia' })
  @ApiOkResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(@Param('id') id: string, @Body() dto: UpdateAudienceDto) {
    const data = await this.service.patch(Number(id), dto);
    return { success: true, data };
  }
@Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar audiencia' })
  @ApiOkResponse()
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id));
    return { success: true, data: true };
  }
}
