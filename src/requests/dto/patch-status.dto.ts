import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class PatchRequestStatusDto {
  @ApiProperty({ example: 'EST', description: 'Debe ser EST' })
  @Length(3, 3)
  @Matches(/^EST$/)
  tab!: string;

  @ApiProperty({ example: '002', description: '002=APROBADO, 003=RECHAZADO' })
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  cod!: string;

  @ApiPropertyOptional({ example: 'Notas de revisión' })
  @IsOptional()
  @IsString()
  notes?: string;
}
