import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QueryKeyWordDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
