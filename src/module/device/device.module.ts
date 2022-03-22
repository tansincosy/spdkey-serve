import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { DeviceController } from './controller/device.controller';
import { DeviceDao } from './dao/device.dao';
import { DeviceService } from './service/device.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [DeviceDao, DeviceService],
  exports: [DeviceDao],
  controllers: [DeviceController],
})
export class DeviceModule {}
