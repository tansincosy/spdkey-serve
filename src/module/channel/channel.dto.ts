import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

export class ParseUrlDTO {
  @IsString()
  @IsUrl({
    require_protocol: true,
    require_valid_protocol: true,
    require_host: true,
  })
  @IsNotEmpty()
  @Matches(/(http:\/\/|https:\/\/).*\.m3u$/)
  url: string;
}
