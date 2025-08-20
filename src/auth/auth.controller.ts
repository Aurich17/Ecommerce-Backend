import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { LoginResponse } from './auth.types';

@ApiTags('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public() // <<<<<< deja /auth/login abierto
  @Post('login')
  @ApiOperation({ summary: 'Login por email y password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login OK' })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.service.login(dto);
  }
}
