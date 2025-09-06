import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Ip,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { LoginResponse } from './auth.types';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

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

  @Public()
  @Post('password/forgot')
  async forgot(
    @Body() dto: ForgotPasswordDto,
    @Ip() ip: string,
    @Req() req: any,
  ) {
    await this.service.requestPasswordReset(
      dto.email.trim(),
      ip,
      req.headers['user-agent'] || '',
    );
    // Siempre responder igual para no filtrar si el email existe:
    return {
      ok: true,
      message: 'Si el email existe, te enviaremos instrucciones.',
    };
  }

  @Public()
  @Post('password/reset')
  async reset(@Body() dto: ResetPasswordDto) {
    await this.service.resetPassword(dto.token, dto.newPassword);
    return { ok: true };
  }
}
