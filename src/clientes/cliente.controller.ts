/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegistroCompletoDto } from './dto/registro-completo.dto';
import { Public } from 'src/auth/public.decorator';

@ApiTags('clientes')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true, // 👈 importante
  }),
)
@Controller('clientes')
export class ClienteController {
  constructor(private readonly servicio: ClienteService) {}

  @Public()
  @Post('registro-completo') // ← usa UNA sola ruta (o duplica a propósito)
  @ApiOperation({ summary: 'Registrar cliente completo (PL/pgSQL)' })
  @ApiBody({ type: RegistroCompletoDto })
  @ApiResponse({
    status: 201,
    description: 'Cliente creado y social security generado',
    schema: {
      properties: {
        social_security: { type: 'string', example: 'CC-100-000' },
      },
    },
  })
  async registrar(@Body() body: RegistroCompletoDto) {
    const result = await this.servicio.registrarCompleto(body);
    return { message: 'Cliente registrado correctamente', ...result };
  }
}
