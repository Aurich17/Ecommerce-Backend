import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  Patch,
  Body,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ListUsersQueryDto } from './dto/list-users.query.dto';
import { PatchAccountStateDto } from './dto/patch-account-state.dto';
import { UserDetailResponse, UsersListResponse } from './dto/user.responses';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios con filtros y paginación' })
  @ApiOkResponse({ type: UsersListResponse })
  @ApiBadRequestResponse({ description: 'Parámetros inválidos' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async list(@Query() query: ListUsersQueryDto) {
    const data = await this.service.list(query);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de usuario' })
  @ApiParam({ name: 'id', example: 'uuid-v4' })
  @ApiOkResponse({ type: UserDetailResponse })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async getOne(@Param('id') id: string) {
    const data = await this.service.getOne(id);
    return { success: true, data };
  }

  @Patch(':id/account-state')
  @ApiOperation({ summary: 'Cambiar estado de cuenta del usuario (EST)' })
  @ApiParam({ name: 'id', example: 'uuid-v4' })
  @ApiOkResponse({ type: UserDetailResponse })
  @ApiBadRequestResponse({
    description: 'Estado inválido o tab distinto a EST',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patchAccountState(
    @Param('id') id: string,
    @Body() body: PatchAccountStateDto,
  ) {
    const data = await this.service.patchAccountState(id, body.tab, body.cod);
    return { success: true, data };
  }
}
