import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private log: Logger;
  constructor(
    private readonly log4J: LoggerService,
    private config: ConfigService,
  ) {
    this.log = this.log4J.getLogger(LoggingInterceptor.name);
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const call$ = next.handle();
    const envName = this.config.get('env');
    if (envName === 'prod') {
      return call$;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const content = `${request.ip} ${request.method} -> ${request.url}`;
    const requestStart = `${request.ip} ${request.method} <- ${request.url}`;
    const now = Date.now();
    this.log.debug('req: %s', requestStart);
    return call$.pipe(
      tap(() => this.log.debug('res:', content, `${Date.now() - now}ms`)),
    );
  }
}
