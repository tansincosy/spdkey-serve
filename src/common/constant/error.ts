import { BasicExceptionCode, UserExceptionCode } from './error.code';

export const BasicException = new Map<
  BasicExceptionCode | UserExceptionCode,
  string
>([
  [BasicExceptionCode.CLIENT_IS_ILLEGAL, 'Invalid client: illegal device'],
  [
    BasicExceptionCode.USERNAME_OR_PASSWORD_IS_ERROR,
    'Invalid user: username or password is incorrect, please re-enter',
  ],
  [BasicExceptionCode.USER_HAD_LOCKED, 'Invalid user: user has been locked'],
  [BasicExceptionCode.SCOPE_INVALID, 'Invalid scope: scope can not be empty'],
  [BasicExceptionCode.SCOPE_IS_WRONG, 'Invalid user: invalid scope'],
  [
    BasicExceptionCode.CLIENT_HAD_LOCKED,
    'Invalid client: client has been locked',
  ],
  [
    BasicExceptionCode.CLIENT_INVALID,
    'Invalid_client: cannot retrieve client credentials',
  ],
  [BasicExceptionCode.TOKEN_INVALID, 'Invalid token: access token is invalid'],
  [
    BasicExceptionCode.REFRESH_TOKEN_INVALID,
    'Invalid grant: refresh token is invalid',
  ],
  [
    BasicExceptionCode.UN_SUPPORT_GRANT_TYPE,
    'Unsupported grant type: `grant_type` is invalid',
  ],
  [BasicExceptionCode.INVALID_REQUEST_ERROR, 'Missing parameter'],
  [
    BasicExceptionCode.ACCESS_TOKEN_EXPIRED,
    'Invalid token: access token has expired',
  ],
  [BasicExceptionCode.UNAUTHORIZED_REQUEST, 'unauthorized_request'],
  [UserExceptionCode.USER_ADD_FAILED, 'user add failed'],
]);
