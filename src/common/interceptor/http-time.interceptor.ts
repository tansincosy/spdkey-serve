import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'log4js';
import { Log4JService } from '../service/log4j.service';

@Injectable()
export class HttpSpendTimeInterceptor implements NestInterceptor {
  private log: Logger;
  constructor(private readonly log4J: Log4JService) {
    this.log = log4J.getLogger('http');
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.log.info(`[server spend time] ::: ${Date.now() - now}ms`),
        ),
      );
  }
}
