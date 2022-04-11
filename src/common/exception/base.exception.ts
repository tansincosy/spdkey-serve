import {
  BasicExceptionCode,
  TMDBErrorCode,
  UserExceptionCode,
} from '@/constant';
import { HttpException } from '@nestjs/common';

import { BasicException } from './message.exception';
export class BaseException extends HttpException {
  constructor(error: BasicExceptionCode | UserExceptionCode | TMDBErrorCode) {
    const msg = BasicException.get(error);
    super(msg, error);
  }
}
