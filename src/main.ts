import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { AllExceptionFilter, LoggerService } from './common';
import { logConfig } from './config/log4js.config';
import { Log } from './util';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Log(logConfig),
  });
  app.useGlobalFilters(new AllExceptionFilter(app.get(LoggerService)));
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      enableDebugMessages: true,
    }),
  );
  await app.listen(process.env.app_port || 3000);
  const banner = await readFileSync('banner.txt');
  console.log(`
${banner}
THE SERVER STARTED ON ${await app.getUrl()}
  `);
}
bootstrap();
