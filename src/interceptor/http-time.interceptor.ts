import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpSpendTimeInterceptor implements NestInterceptor {
  private log: Logger;
  constructor(private readonly log4J: LoggerService) {
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
