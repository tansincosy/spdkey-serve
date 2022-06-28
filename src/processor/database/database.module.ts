import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';
import { PrismaOauthService } from './prisma.service.oauth';

@Global()
@Module({
  providers: [PrismaService, PrismaOauthService],
  exports: [PrismaService, PrismaOauthService],
})
export class DataBaseModule {}
