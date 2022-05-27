import { unknownToNumber } from '@/transform/value.transform';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PaginateBaseDTO {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => unknownToNumber(value))
  @IsOptional()
  @IsNotEmpty()
  current?: number;
  @IsNumber()
  @Max(400)
  @Transform(({ value }) => unknownToNumber(value))
  @IsOptional()
  @IsNotEmpty()
  pageSize?: number;
  @IsString()
  createdAt?: string;
  @IsString()
  updatedAt?: string;
  @IsString()
  @IsOptional()
  id?: string;
}
