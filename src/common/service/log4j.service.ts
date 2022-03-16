import { Log } from '@/util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'log4js';

@Injectable()
export class Log4JService extends Log {
  constructor(private readonly configService: ConfigService) {
    super(configService.get<Configuration>('logger'));
  }
}
