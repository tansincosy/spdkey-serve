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
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { BaseException } from '../exception/base.exception';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import { BasicExceptionCode } from '@/constant/error-code.constant';

/**
 * 所有异常过滤器
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private logger: Logger;

  constructor(private readonly Log4js: LoggerService) {
    this.logger = this.Log4js.getLogger(AllExceptionFilter.name);
  }
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    this.logger.warn(exception);
    switch (true) {
      case exception instanceof UnauthorizedException:
        response.status(HttpStatus.UNAUTHORIZED).json({
          errorCode: `${process.env.APP_NAME}:` + exception.getStatus(),
          errorMessage: exception.message,
        });
        break;
      case exception instanceof BaseException:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.APP_NAME}:` + exception.getStatus(),
          errorMessage: exception.getResponse(),
        });
        break;
      case exception instanceof BadRequestException:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: `${process.env.APP_NAME}:601001`,
          errorMessage: `${exception?.response?.message}`,
        });
        break;
      case exception instanceof PrismaClientValidationError:
      case exception instanceof PrismaClientKnownRequestError:
        response.status(HttpStatus.BAD_REQUEST).json({
          errorCode: exception.code,
          errorMessage: exception.meta?.target,
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
}
