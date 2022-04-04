import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { ConfigureService } from './service/configure.service';
import { ConfigureController } from './controller/configure.controller';
import { ConfigureDao } from './dao/configure.dao';

@Module({
  imports: [UserModule],
  controllers: [ConfigureController],
  providers: [ConfigureService, ConfigureDao],
})
export class ConfigureModule {}
