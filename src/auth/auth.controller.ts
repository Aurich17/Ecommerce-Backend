// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './auth.types';

@ApiTags('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login por email y password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login OK' })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.service.login(dto);
  }
}
