import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { AllExceptionFilter, Log4JService } from './common';
import { logConfig } from './config/log4js.config';
import { Log } from './util';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Log(logConfig),
  });
  await app.listen(process.env.PORT || 3000);
  const log = app.get(Log4JService).getLogger(bootstrap.name);
  app.useGlobalFilters(new AllExceptionFilter(app.get(Log4JService)));
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
    }),
  );
  const banner = await readFileSync('banner.txt');
  log.info(`
${banner}
THE SERVER STARTED ON ${await app.getUrl()}
  `);
}
bootstrap();
