import { HttpException } from '@nestjs/common';
import { BasicException } from '../constant/error';
import { BasicExceptionCode, UserExceptionCode } from '../constant/error.code';
export class BaseException extends HttpException {
  constructor(error: BasicExceptionCode | UserExceptionCode) {
    const msg = BasicException.get(error);
    super(msg, error);
  }
}
