import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as store from 'cache-manager-redis-store';
import { CryptoConfig, EmailConfig, LoggerConfig } from '@/config';
import {
  AuthModule,
  ConfigureModule,
  DeviceModule,
  UserModule,
} from '@/module';
import { CommonModule, HttpRequestMiddleware } from '@/common';

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
      host: process.env.redis_host || '127.0.0.1',
      port: +process.env.redis_prot || 6379,
      isGlobal: true,
    }),
    UserModule,
    DeviceModule,
    AuthModule,
    ConfigureModule,
    // LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(HttpRequestMiddleware).forRoutes('*');
  }
}
