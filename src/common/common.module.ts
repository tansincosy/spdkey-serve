import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpSpendTimeInterceptor } from './interceptor/http-time.interceptor';
import { DownloadService } from './service/download.service';
import { LoggerService } from './service/log4j.service';
import { PrismaService } from './service/prisma.service';

@Global()
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: HttpSpendTimeInterceptor },
    LoggerService,
    PrismaService,
    DownloadService,
  ],
  exports: [LoggerService, PrismaService, DownloadService],
})
export class CommonModule {}
