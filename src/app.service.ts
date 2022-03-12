import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
@Injectable()
export class AppService {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}
  getHello(): string {
    // this.logger.info('sss %s', 'ssss');
    this.logger.debug('ccc');
    this.logger.error('sssss');
    this.logger.warn('cccc');
    return 'Hello World!';
  }
}
