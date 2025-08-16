import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

export class TabParamDto {
  @ApiProperty({ example: 'PAI' })
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  @Transform(({ value }) => String(value).toUpperCase())
  tab!: string;
}

export class TabCodParamDto extends TabParamDto {
  @ApiProperty({ example: '001' })
  @IsString()
  @Length(3, 3)
  @Matches(/^[0-9]{3}$/)
  cod!: string;
}
