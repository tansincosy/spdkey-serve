import { registerAs } from '@nestjs/config';
import { Configuration } from 'log4js';
import { AppConfigLoader } from './app.config';

export const getConfig = () => {
  const config = AppConfigLoader();
  const logConfig: Configuration = {
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
        filename: `${config.log.dir}/interface/i_APP.log`,
        pattern: 'yyyy-MM-dd',
        category: 'http',
        layout: {
          type: 'pattern',
          pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m',
        },
      },
      download: {
        type: 'dateFile',
        filename: `${config.log.dir}/download/d_APP.log`,
        pattern: 'yyyy-MM-dd',
        category: 'download',
        layout: {
          type: 'pattern',
          pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m',
        },
      },
      appLog: {
        type: 'dateFile',
        filename: `${config.log.dir}/app/c_APP.log`,
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
        filename: `${config.log.dir}/error/e_APP.log`,
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
        level: config.log.level,
      },
      http: { appenders: ['access'], level: config.log.level },
      download: { appenders: ['download'], level: config.log.level },
    },
  };
  return logConfig;
};
export const LoggerConfigLoader = registerAs<Configuration>('logger', () =>
  getConfig(),
);
