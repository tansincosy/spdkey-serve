import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filter/any-exception.filter';
import { logConfig } from './processor/config/log4js.config';
import { LoggerService } from './processor/log4j/log4j.service';
import { Log } from './util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Log(logConfig),
  });

  console.log(logConfig);

  app.useGlobalFilters(new AllExceptionFilter(app.get(LoggerService)));
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
    }),
  );
  console.log('bootstrap process.env', process.env.LOG_LEVEL);
  await app.listen(process.env.APP_PORT || 3000);
  console.log(`THE SERVER STARTED ON ${await app.getUrl()}
  `);
}
bootstrap();
