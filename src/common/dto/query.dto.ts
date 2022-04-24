import { IsArray, IsString } from 'class-validator';

export class QueryParams {
  @IsString()
  current?: string;
  @IsString()
  pageSize?: string;
  @IsString()
  id?: string;
}

export class DeleteIdPrams {
  @IsArray()
  ids: string[];
}