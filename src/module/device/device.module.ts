import { Module } from '@nestjs/common';
import { DeviceDao } from './dao/device.dao';

@Module({
  imports: [],
  providers: [DeviceDao],
  exports: [DeviceDao],
})
export class DeviceModule {}
