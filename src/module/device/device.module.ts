import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceDao } from './device.dao';
import { DeviceService } from './device.service';

@Module({
  providers: [DeviceDao, DeviceService],
  exports: [DeviceDao],
  controllers: [DeviceController],
})
export class DeviceModule {}
