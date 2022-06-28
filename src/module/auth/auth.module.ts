import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { DeviceModule } from '../device/device.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [DeviceModule, UserModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService],
})
@Global()
export class AuthModule {}
