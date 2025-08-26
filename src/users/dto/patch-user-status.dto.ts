import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class PatchUserStatusDto {
  @ApiProperty({
    example: 'habilitado',
    description: 'Estado del usuario: habilitado, deshabilitado, etc.',
  })
  @IsString()
  @IsIn(['habilitado', 'deshabilitado', 'suspendido'])
  status!: string;
}
