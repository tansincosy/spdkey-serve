import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'log4js';
import { Log4JService } from '../service/log4j.service';
@Injectable()
export class HttpRequestMiddleware implements NestMiddleware {
  private log: Logger;

  constructor(private readonly log4j: Log4JService) {
    this.log = this.log4j.getLogger('http');
  }
  use(req: Request, res: Response, next: () => void) {
    const code = res.statusCode; // 响应状态码
    next();
    this.log.info(
      `[${req.ip} ${req.method}  ${code}  ${req.url}] `,
      'params ->',
      req.params,
      'query ->',
      req.query,
      'body ->',
      req.body,
    );
  }
}
