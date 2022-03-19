import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HttpRequestMiddleware } from './common/middleware/http-request.middleware';
import * as store from 'cache-manager-redis-store';
import { UserModule } from './module/user/user.module';
import { DeviceModule } from './module/device/device.module';
import { CryptoConfig, EmailConfig, LoggerConfig } from './config';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvFile: false,
      load: [LoggerConfig, EmailConfig, CryptoConfig],
    }),
    CacheModule.register({
      store,
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: +process.env.REDIS_PORT || 6379,
      isGlobal: true,
    }),
    UserModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(HttpRequestMiddleware).forRoutes('*');
  }
}
