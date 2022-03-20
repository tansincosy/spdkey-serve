import { Module } from '@nestjs/common';
import { DeviceController } from './controller/device.controller';
import { DeviceDao } from './dao/device.dao';
import { DeviceService } from './service/device.service';

@Module({
  imports: [],
  providers: [DeviceDao, DeviceService],
  exports: [DeviceDao],
  controllers: [DeviceController],
})
export class DeviceModule {}
