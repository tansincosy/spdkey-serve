import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HttpRequestMiddleware } from './common/middleware/http-request.middleware';
import log4jsConfig from './config/log4js.config';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvFile: false,
      load: [log4jsConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(HttpRequestMiddleware).forRoutes('*');
  }
}
