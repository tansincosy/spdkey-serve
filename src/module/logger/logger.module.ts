import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { LoggerDao } from './logger.dao';
import { LoggerService } from './logger.service';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService, LoggerDao],
})
export class LoggerModule {}
