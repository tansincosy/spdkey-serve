import { QueryParams } from '@/common';
import { IsArray, IsDefined, IsString } from 'class-validator';

export class ConfigDTO {
  @IsString()
  id?: string;
  @IsString()
  introduce?: string;
  @IsString()
  @IsDefined()
  name?: string;
  @IsString()
  @IsDefined()
  value?: string;
  @IsString()
  @IsDefined()
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ConfigQueryDTO extends QueryParams {}

export class DeleteIdPrams {
  @IsArray()
  ids: string[];
}
