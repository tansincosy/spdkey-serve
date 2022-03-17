export enum BasicExceptionCode {
  CLIENT_IS_ILLEGAL = 101005,
  USERNAME_OR_PASSWORD_IS_ERROR = 101001,
  USER_HAD_LOCKED = 101002,
  SCOPE_INVALID = 101003,
  SCOPE_IS_WRONG = 101004,
  CLIENT_HAD_LOCKED = 101006,
  CLIENT_INVALID = 101007,
  TOKEN_INVALID = 101008,
  REFRESH_TOKEN_INVALID = 101009,
  UN_SUPPORT_GRANT_TYPE = 101010,
  INVALID_REQUEST_ERROR = 101011,
  ACCESS_TOKEN_EXPIRED = 101012,
  UNAUTHORIZED_REQUEST = 101013,
}
export const BasicException = new Map<BasicExceptionCode, string>([
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
]);
