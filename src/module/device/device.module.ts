import { Module } from '@nestjs/common';
import { DeviceDao } from './dao/device.dao';
import { DeviceService } from './service/device.service';

@Module({
  imports: [],
  providers: [DeviceDao, DeviceService],
  exports: [DeviceDao],
})
export class DeviceModule {}
