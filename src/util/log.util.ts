import { LoggerService } from '@nestjs/common';
import { Configuration, configure, Log4js } from 'log4js';

export class Log implements LoggerService {
  private lo4j: Log4js;

  constructor(private readonly configuration: Configuration) {
    this.lo4j = configure(this.configuration);
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
