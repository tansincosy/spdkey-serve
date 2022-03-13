import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { Log4JService } from './common';
@Injectable()
export class AppService {
  private logger: Logger;
  constructor(private readonly log4jService: Log4JService) {
    this.logger = log4jService.getLogger(AppService.name);
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
