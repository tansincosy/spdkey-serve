import { IsArray, IsString } from 'class-validator';

export class Config {
  @IsString()
  id?: string;
  @IsString()
  introduce?: string;
  @IsString()
  name?: string;
  @IsString()
  value?: string;
  @IsString()
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DeleteIdPrams {
  @IsArray()
  ids: string[];
}
