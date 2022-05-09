import { QueryParams } from '@/common';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ParseUrlDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/(http:\/\/|https:\/\/).*\.m3u$/)
  url: string;
}

export class QueryChannelSourceDTO extends QueryParams {
  @IsString()
  status?: string;
  @IsString()
  name?: string;
  @IsString()
  language?: string;
}

export class QueryChannelDTO extends QueryParams {}
