import { HttpException } from '@nestjs/common';
import { BasicException, BasicExceptionCode } from '../constant/error';
export class BaseException extends HttpException {
  constructor(error: BasicExceptionCode) {
    const msg = BasicException.get(error);
    super(msg, error);
  }
}
