import { PaginateBaseDTO } from '@/model/paginate.model';
import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ParseUrlDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/(http:\/\/|https:\/\/).*\.m3u$/)
  url: string;

  @IsBoolean()
  isForceUpdate?: boolean;
}

export class QueryChannelSourceDTO extends PaginateBaseDTO {
  @IsString()
  status?: string;
  @IsString()
  name?: string;
  @IsString()
  language?: string;
}

export class QueryChannelDTO extends PaginateBaseDTO {
  @IsBoolean({})
  isForceUpdate?: boolean;
}

export class ChannelQueryDTO extends PaginateBaseDTO {
  @IsString()
  name: string;
}
