import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { ConfigureController } from './configure.controller';
import { ConfigureService } from './configure.service';
import { ConfigureDao } from './configure.dao';

@Module({
  imports: [UserModule],
  controllers: [ConfigureController],
  providers: [ConfigureService, ConfigureDao],
})
export class ConfigureModule {}
