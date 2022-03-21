import { HttpException } from '@nestjs/common';
import { BasicExceptionCode, UserExceptionCode } from '../constant';
import { BasicException } from './message.exception';
export class BaseException extends HttpException {
  constructor(error: BasicExceptionCode | UserExceptionCode) {
    const msg = BasicException.get(error);
    super(msg, error);
  }
}
