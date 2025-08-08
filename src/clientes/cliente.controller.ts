/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateClienteCompletoDto } from './dto/create-cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly servicio: ClienteService) {}

  @Post('completo')
  @ApiOperation({
    summary: 'Registrar cliente completo (invoca el PROC plpgsql)',
  })
  @ApiBody({ type: CreateClienteCompletoDto })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado y social security generado',
    schema: {
      properties: {
        social_security: { type: 'string', example: 'CC-001-234' },
      },
    },
  })
  async registrarCompleto(
    @Body() dto: CreateClienteCompletoDto,
  ): Promise<{ social_security: string }> {
    return this.servicio.registrarCompleto(dto);
  }
}
