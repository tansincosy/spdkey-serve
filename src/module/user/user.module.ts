import { Module } from '@nestjs/common';
import { DeviceModule } from '../device/device.module';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';
import { UserDao } from './dao/user.dao';
import { AuthModelService } from './service/auth-model.service';
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';

@Module({
  imports: [DeviceModule],
  controllers: [AuthController, UserController],
  providers: [AuthModelService, UserDao, AuthService, UserService],
  exports: [AuthService],
})
export class UserModule {}
