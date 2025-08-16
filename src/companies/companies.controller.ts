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
import { CompaniesService } from './companies.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { PatchCompanyDto } from './dto/patch-company.dto';
import { OkCompanyResponse } from './dto/company.responses';

@ApiTags('Empresas')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly service: CompaniesService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar Empresa (user + rol + perfil + documentos)',
  })
  @ApiCreatedResponse({ type: OkCompanyResponse })
  @ApiBadRequestResponse({ description: 'Validaciones fallidas' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async register(@Body() dto: RegisterCompanyDto) {
    const data = await this.service.register(dto);
    return { success: true, data };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener Empresa por userId (representante)' })
  @ApiParam({ name: 'userId', example: 'uuid-v4' })
  @ApiOkResponse({ type: OkCompanyResponse })
  @ApiNotFoundResponse({ description: 'No existe' })
  async getOne(@Param('userId') userId: string) {
    const data = await this.service.getOne(userId);
    return { success: true, data };
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Actualizar parcialmente el perfil de Empresa' })
  @ApiOkResponse({ type: OkCompanyResponse })
  @ApiNotFoundResponse({ description: 'No existe' })
  @ApiBadRequestResponse({ description: 'Validación de tipos' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(@Param('userId') userId: string, @Body() body: PatchCompanyDto) {
    const data = await this.service.patch(userId, body);
    return { success: true, data };
  }
}
