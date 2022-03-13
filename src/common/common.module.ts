import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpSpendTimeInterceptor } from './interceptor/http-time.interceptor';
import { Log4JService } from './service/log4j.service';

@Global()
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: HttpSpendTimeInterceptor },
    Log4JService,
  ],
  exports: [Log4JService],
})
export class CommonModule {}
