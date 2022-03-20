import { IsString } from 'class-validator';

export class DeviceDTO {
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
}
