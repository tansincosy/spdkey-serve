import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { LoggerService } from './common';
@Injectable()
export class AppService {
  private logger: Logger;
  constructor(private readonly loggerService: LoggerService) {
    this.logger = loggerService.getLogger(AppService.name);
  }
  getHello(): string {
    // this.logger.info('sss %s', 'ssss');
    this.logger.info('ssss %s', 'sss');
    this.logger.debug('ccc', 'ccc');
    this.logger.error('sssss');
    this.logger.warn('cccc');
    return 'Hello World!';
  }
}
