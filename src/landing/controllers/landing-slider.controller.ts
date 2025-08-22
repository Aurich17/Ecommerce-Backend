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
// import { LandingSliderService } from './landing-slider.service';
import { PagingQueryDto } from '../dto/paging.dto';
import { CreateSliderDto, UpdateSliderDto } from '../dto/slider.dto';
import { Public } from 'src/auth/public.decorator';
import { LandingSliderService } from '../services/landing-slider.service';

@ApiTags('Landing - Slider')
@Controller('landing/slider')
export class LandingSliderController {
  constructor(private readonly service: LandingSliderService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar imágenes del slider' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiOkResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async list(@Query() q: PagingQueryDto & { status?: string }) {
    const data = await this.service.list(q);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener imagen del slider' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse()
  async getOne(@Param('id') id: string) {
    const data = await this.service.getOne(Number(id));
    return { success: true, data };
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear imagen del slider' })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateSliderDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }

  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar imagen del slider' })
  @ApiOkResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(@Param('id') id: string, @Body() dto: UpdateSliderDto) {
    const data = await this.service.patch(Number(id), dto);
    return { success: true, data };
  }

  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar imagen del slider' })
  @ApiOkResponse()
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id));
    return { success: true, data: true };
  }
}
