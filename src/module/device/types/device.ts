import { IsNumber, IsString } from 'class-validator';

export class DeviceDTO {
  @IsNumber()
  isOnline?: number;
  @IsNumber()
  isLocked?: number;
  id?: string;
  @IsString()
  readonly deviceId: string;
  @IsString()
  readonly os: string;
  @IsString()
  readonly name: string;
  @IsString()
  readonly type: string;
  @IsString()
  readonly engine: string;
  deviceSecret?: string;
  grants?: string[];
  @IsNumber()
  accessTokenValidateSeconds?: number;
  @IsNumber()
  refreshTokenValidateSeconds?: number;
}
