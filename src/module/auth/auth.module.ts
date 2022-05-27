import { Global, Module } from '@nestjs/common';
import { DeviceModule } from '../device/device.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthModelService } from './auth-model.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthOAuthStrategy } from './auth.service.oauth2.strategy';

@Module({
  imports: [DeviceModule, UserModule],
  controllers: [AuthController],
  providers: [AuthModelService, AuthService, UserService, AuthOAuthStrategy],
  exports: [AuthService],
})
@Global()
export class AuthModule {}
