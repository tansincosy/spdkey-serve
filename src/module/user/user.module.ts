import { Module } from '@nestjs/common';
import { DeviceModule } from '../device/device.module';
import { AuthController } from './controller/auth.controller';
import { UserDao } from './dao/user.dao';
import { AuthModelService } from './service/auth-model.service';
import { AuthService } from './service/auth.service';

@Module({
  imports: [DeviceModule],
  controllers: [AuthController],
  providers: [AuthModelService, UserDao, AuthService],
})
export class UserModule {}
