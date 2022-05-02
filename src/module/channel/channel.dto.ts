import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

export class ParseUrlDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/(http:\/\/|https:\/\/).*\.m3u$/)
  url: string;
}
