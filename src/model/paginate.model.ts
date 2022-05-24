import { unknownToNumber } from '@/transform/value.transform';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginateBaseDTO {
  @IsString()
  @Min(1)
  @Transform(({ value }) => unknownToNumber(value))
  @IsOptional()
  @IsNotEmpty()
  current?: number;
  @IsString()
  @Max(50)
  @Transform(({ value }) => unknownToNumber(value))
  @IsOptional()
  @IsNotEmpty()
  pageSize?: number;
  @IsString()
  createdAt?: string;
  @IsString()
  updatedAt?: string;
}
