import {
  BasicExceptionCode,
  UserExceptionCode,
} from '@/constant/error-code.constant';
import { TMDBErrorCode } from '@/constant/tmdb.constant';
import { HttpException } from '@nestjs/common';

import { BasicException } from './message.exception';
export class BaseException extends HttpException {
  constructor(error: BasicExceptionCode | UserExceptionCode | TMDBErrorCode) {
    const msg = BasicException.get(error);
    super(msg, error);
  }
}
