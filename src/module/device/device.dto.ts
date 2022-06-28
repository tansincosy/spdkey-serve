import { PaginateBaseDTO } from '@/model/paginate.model';
import { IsNumber, IsString } from 'class-validator';

export class DeviceDTO {
  @IsNumber()
  isOnline?: number;
  @IsNumber()
  isLocked?: number;
  @IsString()
  deviceId: string;
  @IsString()
  os: string;
  @IsString()
  name: string;
  @IsString()
  type: string;
  @IsString()
  engine: string;
  deviceSecret?: string;
  grants?: string[];
  @IsNumber()
  accessTokenValidateSeconds?: number;
  @IsNumber()
  refreshTokenValidateSeconds?: number;
  id?: string;
}

export class DeviceParams extends PaginateBaseDTO {
  @IsString()
  name: string;
  @IsNumber()
  isOnline?: number;
  @IsNumber()
  isLocked?: number;
}
