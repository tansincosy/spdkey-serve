import { HttpException } from '@nestjs/common';

export interface ErrorCode {
  code: number;
  msg: string;
}

export interface BaseError {
  [propName: string]: ErrorCode;
}

export class BaseException extends HttpException {
  constructor(error: ErrorCode) {
    super(error.msg, error.code);
  }
}
