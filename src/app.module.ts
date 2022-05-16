import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as store from 'cache-manager-redis-store';
import {
  CommonConfig,
  CryptoConfig,
  EmailConfig,
  LoggerConfig,
} from '@/config';
import {
  AuthModule,
  ChannelModule,
  ConfigureModule,
  DeviceModule,
  LoggerModule,
  ProgramModule,
  UserModule,
} from '@/module';
import { CommonModule, HttpRequestMiddleware } from '@/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    CommonModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvFile: false,
      load: [LoggerConfig, EmailConfig, CryptoConfig, CommonConfig],
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
    ChannelModule,
    ProgramModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(HttpRequestMiddleware).forRoutes('*');
  }
}
