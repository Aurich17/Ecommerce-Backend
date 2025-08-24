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
import { ProductsService } from './products.service';
import { ListProductsQueryDto } from './dto/list-products.query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PatchProductDto } from './dto/patch-product.dto';
import {
  ProductDetailResponse,
  ProductsListResponse,
} from './dto/product.responses';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}
  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar productos (usa vista v_products_list)' })
  @ApiOkResponse({ type: ProductsListResponse })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'sellerUserId', required: false })
  @ApiQuery({ name: 'enabled', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async list(@Query() q: ListProductsQueryDto) {
    const data = await this.service.list(q);
    return { success: true, data };
  }

  @Get('seller/:sellerId')
  @ApiOperation({ summary: 'Listar productos por seller_user_id' })
  @ApiParam({ name: 'sellerId', example: 'uuid-v4' })
  @ApiOkResponse({ type: ProductsListResponse })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'enabled', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async listBySeller(
    @Param('sellerId') sellerId: string,
    @Query() q: ListProductsQueryDto,
  ) {
    // Forzar el sellerId en la query
    q.sellerUserId = sellerId;
    const data = await this.service.list(q);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de producto' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: ProductDetailResponse })
  async getOne(@Param('id') id: string) {
    const data = await this.service.getOne(Number(id));
    return { success: true, data };
  }
  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear producto' })
  @ApiCreatedResponse({ type: ProductDetailResponse })
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateProductDto) {
    const data = await this.service.create(dto);
    return { success: true, data };
  }
  @Public()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiOkResponse({ type: ProductDetailResponse })
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(@Param('id') id: string, @Body() dto: PatchProductDto) {
    const data = await this.service.patch(Number(id), dto);
    return { success: true, data };
  }

  @Patch(':id/disable')
  @ApiOperation({ summary: 'Desactivar producto (enabled = false)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: ProductDetailResponse })
  async disable(@Param('id') id: string) {
    const data = await this.service.disable(Number(id));
    return { success: true, data };
  }

  @Patch(':id/enable')
  @ApiOperation({ summary: 'Activar producto (enabled = true)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiOkResponse({ type: ProductDetailResponse })
  async enable(@Param('id') id: string) {
    const data = await this.service.enable(Number(id));
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiOkResponse()
  async remove(@Param('id') id: string) {
    await this.service.remove(Number(id));
    return { success: true, data: true };
  }
}
