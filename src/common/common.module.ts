import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpSpendTimeInterceptor } from './interceptor/http-time.interceptor';
import { LoggerService } from './service/log4j.service';
import { PrismaService } from './service/prisma.service';

@Global()
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: HttpSpendTimeInterceptor },
    LoggerService,
    PrismaService,
  ],
  exports: [LoggerService, PrismaService],
})
export class CommonModule {}
