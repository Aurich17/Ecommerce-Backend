import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatchUserStatusDto {
  @ApiProperty({ example: '001', description: 'Código de estado (tabla EST)' })
  @IsString()
  @Length(1, 3)
  status!: string; // 001 | 002 | 003 ...
}
