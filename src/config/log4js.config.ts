import { registerAs } from '@nestjs/config';
import { Configuration } from 'log4js';

export default registerAs('logger', () => {
  const logConfig: Configuration = {
    appenders: {
      console: { type: 'console' },
      access: {
        type: 'dateFile',
        filename: 'logs/access.log',
        pattern: '-yyyy-MM-dd',
        category: 'http',
      },
      appLog: {
        type: 'dateFile',
        filename: `logs/app.log`,
        pattern: '-yyyy-MM-dd',
        keepFileExt: true,
        compress: true,
      },
      appLogFilter: {
        type: 'categoryFilter',
        exclude: 'sqlConsole',
        appender: 'appLog',
      },
      errorFile: {
        type: 'dateFile',
        filename: `logs/error.log`,
        alwaysIncludePattern: true,
        pattern: 'yyyy-MM-dd',
        keepFileExt: true,
        compress: true,
      },
      errors: {
        type: 'logLevelFilter',
        level: 'ERROR',
        appender: 'errorFile',
      },
    },
    categories: {
      default: {
        appenders: ['console', 'appLogFilter', 'errors'],
        level: 'debug',
      },
      http: { appenders: ['access'], level: 'info' },
    },
  };
  return logConfig;
});
