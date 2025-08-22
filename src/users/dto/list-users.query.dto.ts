import { IsInt, Min, IsOptional, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class ListUsersQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  q?: string;

  @IsOptional()
  @Matches(/^[0-9]{3}$/)
  estCod?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  roleId?: number;
}
