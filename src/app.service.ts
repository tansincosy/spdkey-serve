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
    return 'Hello World!';
  }
}
