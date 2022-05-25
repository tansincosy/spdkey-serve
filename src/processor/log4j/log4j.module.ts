import { Global, Module } from '@nestjs/common';
import { LoggerService } from './log4j.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
