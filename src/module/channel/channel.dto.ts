import { IsNotEmpty, IsString, IsArray, Matches } from 'class-validator';

export class ParseUrlDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/(http:\/\/|https:\/\/).*\.m3u$/)
  url: string;
}

export class QueryChannelSourceDTO {
  @IsString()
  current?: string;
  @IsString()
  pageSize?: string;
  @IsString()
  createdAt?: string;
  @IsString()
  updatedAt?: string;
  @IsString()
  status?: string;
  @IsString()
  name?: string;
  @IsString()
  language?: string;
}

export class DelIdDTO {
  @IsArray()
  ids: string[];
}
