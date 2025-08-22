import {
  Body,
  Controller,
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
import { RequestsService } from './requests.service';
import { ListRequestsQueryDto } from './dto/list-requests.query.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { PatchRequestStatusDto } from './dto/patch-status.dto';
import {
  RequestDetailResponse,
  RequestsListResponse,
} from './dto/request.responses';
import { Public } from 'src/auth/public.decorator';
@ApiTags('Solicitudes')
@Controller('requests')
export class RequestsController {
  constructor(private readonly service: RequestsService) {}
@Public()
  @Get()
  @ApiOperation({
    summary: 'Listar solicitudes (filtros por tipo REQ y estado EST)',
  })
  @ApiOkResponse({ type: RequestsListResponse })
  @ApiQuery({ name: 'reqCod', required: false })
  @ApiQuery({ name: 'estCod', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async list(@Query() q: ListRequestsQueryDto) {
    const data = await this.service.list(q);
    return { success: true, data };
  }
@Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una solicitud' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: RequestDetailResponse })
  async getOne(@Param('id') id: string) {
    const data = await this.service.getOne(Number(id));
    return { success: true, data };
  }
@Public()
  @Post()
  @ApiOperation({ summary: 'Crear solicitud' })
  @ApiCreatedResponse({ type: RequestDetailResponse })
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateRequestDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }
@Public()
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Cambiar estado de la solicitud (APROBAR/RECHAZAR)',
  })
  @ApiParam({ name: 'id', example: 10 })
  @ApiOkResponse({ type: RequestDetailResponse })
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patchStatus(
    @Param('id') id: string,
    @Body() body: PatchRequestStatusDto,
  ) {
    // Si tienes auth, pasa el userId del admin revisor aquí:
    const reviewerUserId = undefined;
    const data = await this.service.patchStatus(
      Number(id),
      body,
      reviewerUserId,
    );
    return { success: true, data };
  }
}
