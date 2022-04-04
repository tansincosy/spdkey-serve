import { Module } from '@nestjs/common';
import { LoggerController } from './controller/logger.controller';
import { LoggerDao } from './dao/logger.dao';
import { LoggerService } from './service/logger.service';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService, LoggerDao],
})
export class LoggerModule {}
