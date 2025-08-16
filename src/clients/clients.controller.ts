import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { RegisterClientDto } from './dto/register-client.dto';
import { PatchClientDto } from './dto/patch-client.dto';
import { OkClientResponse } from './dto/client.responses';

@ApiTags('Clientes')
@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar Cliente (user + rol + perfil + documentos)',
  })
  @ApiCreatedResponse({ type: OkClientResponse })
  @ApiBadRequestResponse({ description: 'Validaciones fallidas' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() dto: RegisterClientDto) {
    const data = await this.service.register(dto);
    return { success: true, data };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener Cliente por userId' })
  @ApiParam({ name: 'userId', example: 'uuid-v4' })
  @ApiOkResponse({ type: OkClientResponse })
  @ApiNotFoundResponse({ description: 'No existe' })
  async getOne(@Param('userId') userId: string) {
    const data = await this.service.getOne(userId);
    return { success: true, data };
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Actualizar parcialmente el perfil de Cliente' })
  @ApiOkResponse({ type: OkClientResponse })
  @ApiNotFoundResponse({ description: 'No existe' })
  @ApiBadRequestResponse({ description: 'Validación de tipos' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(@Param('userId') userId: string, @Body() body: PatchClientDto) {
    const data = await this.service.patch(userId, body);
    return { success: true, data };
  }
}
