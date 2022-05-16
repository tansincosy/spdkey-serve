import { registerAs } from '@nestjs/config';
import { Configuration } from 'log4js';

export const logConfig: Configuration = {
  appenders: {
    logstash: {
      type: '@log4js-node/logstash-http',
      url: 'http://localhost:3000/logger',
      application: 'logstash-log4js',
      logType: 'application',
      logChannel: 'node',
    },
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c -%] %m',
      },
    },
    access: {
      type: 'dateFile',
      filename: 'app_data/log/interface/http.log',
      pattern: 'yyyy-MM-dd',
      category: 'http',
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m',
      },
    },
    download: {
      type: 'dateFile',
      filename: 'app_data/log/download/download.log',
      pattern: 'yyyy-MM-dd',
      category: 'download',
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m',
      },
    },
    appLog: {
      type: 'dateFile',
      filename: `app_data/log/app/app.log`,
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
      filename: `app_data/log/error/error.log`,
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
      level: process.env.app_log_level || 'info',
    },
    http: { appenders: ['access'], level: 'info' },
    download: { appenders: ['download'], level: 'info' },
  },
};
export const LoggerConfig = registerAs('logger', () => logConfig);
