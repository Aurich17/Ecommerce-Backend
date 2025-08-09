// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario@dominio.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Secreta123' })
  @IsString()
  password: string;
}
