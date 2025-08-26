// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'empresa@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'empresa123' })
  @IsString()
  password: string;
}
