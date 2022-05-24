enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  TRACE = 'trace',
}

export interface Log {
  level?: LogLevel;
  path?: string;
}

export interface Common {
  data?: string;
  port?: number;
  version?: string;
  name?: string;
}

export interface Redis {
  host?: string;
  port?: number;
}

interface DatabaseInfo {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
}

export interface Cache {
  redis?: Redis;
}

export interface Database {
  mysql?: DatabaseInfo;
}

export interface Token {
  access: string;
  refresh: string;
  passKey: string;
}

interface EncryptedApp {
  key: string;
  iv: string;
}
export interface Encrypted {
  token?: Token;
  app?: EncryptedApp;
}

export interface Mail {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  redirect?: string;
  secure?: boolean;
}

export interface AppConfig {
  app?: Common;
  log?: Log;
  database?: DatabaseInfo;
  cache?: Cache;
  encrypted?: Encrypted;
  mail?: Mail;
}
