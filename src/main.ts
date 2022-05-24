import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter, LoggerService } from './common';
import { logConfig } from './config/log4js.config';
import { Log } from './util';
import Config from './config/yaml.config';

const appConfig = Config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Log(logConfig),
  });
  app.useGlobalFilters(new AllExceptionFilter(app.get(LoggerService)));
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      enableDebugMessages: true,
      forbidUnknownValues: true,
    }),
  );
  await app.listen(appConfig.app.port || 3000);
  console.log(`
  ██╗███╗   ██╗   ██╗  ██╗ █████╗ ███╗   ██╗████████╗██╗   ██╗
  ██║████╗  ██║   ██║ ██╔╝██╔══██╗████╗  ██║╚══██╔══╝██║   ██║
  ██║██╔██╗ ██║   █████╔╝ ███████║██╔██╗ ██║   ██║   ██║   ██║
  ██║██║╚██╗██║   ██╔═██╗ ██╔══██║██║╚██╗██║   ██║   ╚██╗ ██╔╝
  ██║██║ ╚████║██╗██║  ██╗██║  ██║██║ ╚████║   ██║    ╚████╔╝ 
  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝     ╚═══╝ 
THE SERVER STARTED ON ${await app.getUrl()}
  `);
}
bootstrap();
