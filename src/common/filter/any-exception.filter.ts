import { BasicExceptionCode } from './../constant/error-code';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  OAuthError,
  InvalidClientError,
  UnsupportedGrantTypeError,
  InvalidScopeError,
  InvalidRequestError,
  InvalidTokenError,
  UnauthorizedClientError,
  UnauthorizedRequestError,
} from 'oauth2-server';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { BaseException } from '../exception/base.exception';
import { Logger } from 'log4js';
import { LoggerService } from '../service/log4j.service';

/**
 * 所有异常过滤器
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger: Logger;

  constructor(private readonly Log4js: LoggerService) {
    this.logger = this.Log4js.getLogger(AllExceptionFilter.name);
  }

  catch(exception: HttpException | OAuthError | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.warn(exception);
    this.logger.debug(
      'exception instanceof UnauthorizedRequestError',
      exception instanceof UnauthorizedRequestError,
    );
    switch (true) {
      case exception instanceof OAuthError:
        this.catchOAuthException(exception, response);
        break;
      case exception instanceof UnauthorizedException:
        response.status(HttpStatus.UNAUTHORIZED).json({
          errorCode: `${process.env.app_name}:` + exception.getStatus(),
          errorMessage: exception.message,
        });
        break;
      case exception instanceof BaseException:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.app_name}:` + exception.getStatus(),
          errorMessage: exception.getResponse(),
        });
        break;
      case exception instanceof BadRequestException:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.app_name}:601001`,
          errorMessage: `${exception?.response?.message}`,
        });
        break;
      case exception instanceof PrismaClientValidationError:
      case exception instanceof PrismaClientKnownRequestError:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: exception.code,
          errorMessage: exception.meta.target,
        });
        break;
      case exception instanceof NotFoundException:
        response.status(HttpStatus.NOT_FOUND).json({
          errorCode: 404,
          errorMessage: '请求地址不存在',
        });
        break;
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          errorCode: 500,
          errorMessage: '服务端异常',
        });
    }
  }

  catchOAuthException(
    exception: OAuthError | any,
    response: Response<any, Record<string, any>>,
  ) {
    switch (true) {
      case exception instanceof UnauthorizedRequestError:
        response.status(HttpStatus.UNAUTHORIZED).json({
          errorCode: `${process.env.app_name}:${BasicExceptionCode.UNAUTHORIZED_REQUEST}`,
          errorMessage: exception.message,
        });
        break;
      case exception instanceof InvalidClientError:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.app_name}:${BasicExceptionCode.CLIENT_INVALID}`,
          errorMessage: exception.message,
        });
        break;
      case exception instanceof UnsupportedGrantTypeError:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.app_name}:${BasicExceptionCode.UN_SUPPORT_GRANT_TYPE}`,
          errorMessage: exception.message,
        });
        break;
      case exception instanceof InvalidScopeError:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.app_name}:${BasicExceptionCode.SCOPE_INVALID}`,
          errorMessage: exception.message,
        });
        break;
      case exception instanceof InvalidRequestError:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.app_name}:${BasicExceptionCode.INVALID_REQUEST_ERROR}`,
          errorMessage: exception.message,
        });
        break;
      case exception instanceof UnauthorizedClientError:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.app_name}:${BasicExceptionCode.UNAUTHORIZED_REQUEST}`,
          errorMessage: exception.message,
        });
        break;
      case exception instanceof InvalidTokenError:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.app_name}:${BasicExceptionCode.TOKEN_INVALID}`,
          errorMessage: exception.message,
        });
        break;
      default:
        if (exception.status === 503) {
          response.status(HttpStatus.UNAUTHORIZED).json({
            errorCode: `${process.env.app_name}` + exception.inner.status,
            errorMessage: exception.message,
          });
        }
        break;
    }
  }
}
