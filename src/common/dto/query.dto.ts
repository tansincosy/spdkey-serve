import { IsArray, IsString } from 'class-validator';

export class QueryParams {
  @IsString()
  current?: string;
  @IsString()
  pageSize?: string;
  @IsString()
  id: string;
  @IsString()
  createdAt?: string;
  @IsString()
  updatedAt?: string;
}

export class DeleteIdPrams {
  @IsArray()
  ids: string[];
}
