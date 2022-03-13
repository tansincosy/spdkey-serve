import { NestFactory } from '@nestjs/core';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { Log4JService } from './common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Log4JService));
  await app.listen(process.env.PORT || 3000);
  const log = app.get(Log4JService).getLogger(bootstrap.name);
  const banner = await readFileSync('banner.txt');
  log.info(`
${banner}
THE SERVER STARTED ON ${await app.getUrl()}
  `);
}
bootstrap();
