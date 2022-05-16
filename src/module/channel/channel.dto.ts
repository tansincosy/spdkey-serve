import { QueryParams } from '@/common';
import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ParseUrlDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/(http:\/\/|https:\/\/).*\.m3u$/)
  url: string;

  @IsBoolean()
  isForceUpdate?: boolean;
}

export class QueryChannelSourceDTO extends QueryParams {
  @IsString()
  status?: string;
  @IsString()
  name?: string;
  @IsString()
  language?: string;
}

export class QueryChannelDTO extends QueryParams {
  @IsBoolean({})
  isForceUpdate?: boolean;
}

export class ChannelQueryDTO extends QueryParams {
  @IsString()
  name: string;
}
