import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TiposService } from './tipos.service';
import { TabParamDto, TabCodParamDto } from './dto/params.dto';
import { CreateTipoDto } from './dto/create-tipo.dto';

// (Opcional) si ya tienes RolesGuard:
// import { Roles } from '@/auth/roles.decorator';

@Controller('tipos')
export class TiposController {
  constructor(private readonly service: TiposService) {}

  @Get(':tab')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getByTab(@Param() { tab }: TabParamDto) {
    const data = await this.service.findByTab(tab);
    return { success: true, data };
  }

  @Get(':tab/:cod')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getOne(@Param() { tab, cod }: TabCodParamDto) {
    const data = await this.service.findOne(tab, cod);
    return { success: true, data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @Roles('admin') // cuando actives RBAC
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateTipoDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }
}
