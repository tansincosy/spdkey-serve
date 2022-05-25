import { PaginateBaseDTO } from '@/model/paginate.model';
import { IsDefined, IsString } from 'class-validator';

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

export class ConfigQueryDTO extends PaginateBaseDTO {}
