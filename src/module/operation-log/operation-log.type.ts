import { PaginateBaseDTO } from '@/model/paginate.model';
import { IsString } from 'class-validator';

export class OperationLogDTO {
  id?: string;
  level?: string;
  message?: string;
  context?: string;
  user?: string;
}

export class QueryLogPrams extends PaginateBaseDTO {
  @IsString()
  context?: string;
}
