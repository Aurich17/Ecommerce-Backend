import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Length, Matches, IsOptional, IsString } from 'class-validator';

export class PatchOrderStatusDto {
  @ApiProperty({ example: 'SOL', description: 'Debe ser SOL' })
  @Length(3, 3)
  @Matches(/^SOL$/)
  tab!: string;

  @ApiProperty({ example: '002', description: '002=Aprobada, 003=Rechazada' })
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  cod!: string;

  @ApiPropertyOptional({ example: 'Verificada por admin' })
  @IsOptional()
  @IsString()
  notes?: string;
}
