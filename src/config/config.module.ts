import { ConfigModule } from '@nestjs/config';
import { CommonConfig } from './common.config';
import { CryptoConfig } from './crypto.config';
import { LoggerConfig } from './log4js.config';
import { EmailConfig } from './mail.config';

const AppConfigModule = ConfigModule.forRoot({
  cache: true,
  isGlobal: true,
  ignoreEnvFile: false,
  load: [LoggerConfig, EmailConfig, CryptoConfig, CommonConfig],
});

export { AppConfigModule };
