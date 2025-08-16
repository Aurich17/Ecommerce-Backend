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
import { OrdersService } from './orders.service';
import { ListOrdersQueryDto } from './dto/list-orders.query.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { PatchOrderStatusDto } from './dto/patch-status.dto';
import { OrderDetailResponse, OrdersListResponse } from './dto/order.responses';

@ApiTags('Órdenes')
@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar órdenes (usa vista v_orders_list)' })
  @ApiOkResponse({ type: OrdersListResponse })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'statusCod', required: false })
  @ApiQuery({ name: 'currencyCod', required: false })
  @ApiQuery({ name: 'buyerUserId', required: false })
  @ApiQuery({ name: 'sellerUserId', required: false })
  @ApiQuery({ name: 'issuedFrom', required: false })
  @ApiQuery({ name: 'issuedTo', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async list(@Query() q: ListOrdersQueryDto) {
    const data = await this.service.list(q);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de orden' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: OrderDetailResponse })
  async getOne(@Param('id') id: string) {
    const data = await this.service.getOne(Number(id));
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: 'Crear orden con items[]' })
  @ApiCreatedResponse({ type: OrderDetailResponse })
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateOrderDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de la orden (SOL)' })
  @ApiParam({ name: 'id', example: 10 })
  @ApiOkResponse({ type: OrderDetailResponse })
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patchStatus(@Param('id') id: string, @Body() dto: PatchOrderStatusDto) {
    const data = await this.service.patchStatus(Number(id), dto);
    return { success: true, data };
  }
}
