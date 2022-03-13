import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, configure, Log4js } from 'log4js';

@Injectable()
export class Log4JService implements LoggerService {
  private lo4j: Log4js;

  constructor(private readonly configService: ConfigService) {
    const log4jsConfig = this.configService.get<Configuration>('logger');
    this.lo4j = configure(log4jsConfig);
  }

  getLogger(moduleName: string) {
    return this.lo4j.getLogger(moduleName);
  }

  debug(message: any, context?: string): any {
    this.lo4j.getLogger(context).debug(message);
  }

  error(message: any, trace?: string, context?: string): any {
    this.lo4j.getLogger(context).error(message, trace);
  }

  log(message: any, context?: string): any {
    this.lo4j.getLogger(context).info(message);
  }

  warn(message: any, context?: string): any {
    this.lo4j.getLogger(context).warn(message);
  }
}
