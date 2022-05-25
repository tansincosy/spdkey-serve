import { Log } from '@/util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'log4js';

@Injectable()
export class LoggerService extends Log {
  constructor(configService: ConfigService) {
    super(configService.get<Configuration>('logger'));
  }
}

// 作为参数导出
export { Logger } from 'log4js';
