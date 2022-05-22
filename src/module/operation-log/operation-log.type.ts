import { QueryParams } from '@/common';
import { IsString } from 'class-validator';

export class OperationLogDTO {
  id?: string;
  level?: string;
  message?: string;
  context?: string;
  user?: string;
}

export class QueryLogPrams extends QueryParams {
  @IsString()
  context?: string;
}
