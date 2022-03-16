import { Module } from '@nestjs/common';
import { DeviceModule } from '../device/device.module';
import { AuthController } from './controller/auth.controller';
import { AuthModelService } from './service/auth.model.service';

@Module({
  imports: [DeviceModule],
  controllers: [AuthController],
  providers: [AuthModelService],
})
export class UserModule {}
