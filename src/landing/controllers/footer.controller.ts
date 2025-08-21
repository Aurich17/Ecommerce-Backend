import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FooterService } from '../services/footer.service';
import {
  CreateFooterDto,
  FooterResponseDto,
  UpdateFooterDto,
} from '../dto/footer.dto';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Landing - Footer')
@Controller('landing/footer')
export class FooterController {
  constructor(private readonly service: FooterService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener footer y datos de contacto' })
  @ApiOkResponse({ type: FooterResponseDto })
  async get() {
    const data = await this.service.get();
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: 'Inicializar footer (una sola vez)' })
  @ApiCreatedResponse({ type: FooterResponseDto })
  @ApiBadRequestResponse()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() dto: CreateFooterDto) {
    const data = await this.service.createIfMissing(dto);
    return { success: true, data };
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar footer' })
  @ApiOkResponse({ type: FooterResponseDto })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async patch(@Body() dto: UpdateFooterDto) {
    const data = await this.service.patch(dto);
    return { success: true, data };
  }
}
