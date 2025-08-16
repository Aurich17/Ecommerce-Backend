import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'Excelentes productos' })
  @IsString()
  comment!: string;

  @ApiPropertyOptional({ example: 'uuid-usuario' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: 'Carlos Gómez' })
  @IsOptional()
  @IsString()
  clientName?: string;
  @ApiPropertyOptional({ example: 'Ingeniero de Software' })
  @IsOptional()
  @IsString()
  occupationText?: string;

  @ApiPropertyOptional({ example: 'OCU' })
  @IsOptional()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  occupationTab?: string;
  @ApiPropertyOptional({ example: '001' })
  @IsOptional()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  occupationCod?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
export class UpdateTestimonialDto {
  @ApiPropertyOptional() @IsOptional() @IsString() comment?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() clientName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() occupationText?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  occupationTab?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  occupationCod?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() enabled?: boolean;
}
