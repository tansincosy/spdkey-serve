import { secretMask } from '@/util';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { cloneDeep } from 'lodash';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
@Injectable()
export class HttpRequestMiddleware implements NestMiddleware {
  private log: Logger;

  constructor(private readonly log4j: LoggerService) {
    this.log = this.log4j.getLogger('http');
  }
  use(req: Request, res: Response, next: () => void) {
    const code = res.statusCode; // 响应状态码
    next();
    const requestBody = cloneDeep(req.body);
    if (requestBody.password) {
      requestBody.password = secretMask(requestBody.password);
    }
    this.log.info(
      'ip = %s, method = %s code = %s, url = %s,params = %s , query = %s, body = %s',
      req.ip,
      req.method,
      code,
      req.url,
      req.params,
      req.query,
      requestBody,
    );
  }
}
