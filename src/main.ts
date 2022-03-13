import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Log4JService } from './common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Log4JService));
  await app.listen(3000);
}
bootstrap();
