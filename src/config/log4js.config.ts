import { registerAs } from '@nestjs/config';
import { Configuration } from 'log4js';

export const logConfig: Configuration = {
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c -%] %m',
      },
    },
    access: {
      type: 'dateFile',
      filename: 'logs/access.log',
      pattern: 'yyyy-MM-dd',
      category: 'http',
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m',
      },
    },
    appLog: {
      type: 'dateFile',
      filename: `logs/app.log`,
      pattern: 'yyyy-MM-dd',
      keepFileExt: true,
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m',
      },
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
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m',
      },
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
      level: process.env.LOG_LEVEL || 'info',
    },
    http: { appenders: ['access'], level: 'info' },
  },
};
export const LoggerConfig = registerAs('logger', () => logConfig);
