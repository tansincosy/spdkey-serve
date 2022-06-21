import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as store from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { AppConfigLoader } from '@/processor/config/app.config';
import { LoggerConfigLoader } from '@/processor/config/log4js.config';
import { UserModule } from '@/module/user/user.module';
import { DeviceModule } from '@/module/device/device.module';
import { AuthModule } from '@/module/auth/auth.module';
import { ChannelModule } from '@/module/channel/channel.module';
import { ProgramModule } from '@/module/program/program.module';
import { OperationLogModule } from '@/module/operation-log/operation-log.module';
import { DataBaseModule } from '@/processor/database/database.module';
import { LoggerModule } from './processor/log4j/log4j.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigureModule } from './module/custom-config/configure.module';
import { LoggingInterceptor } from './interceptor/logger.interceptor';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';

const cacheRedisStore = () => {
  if (process.env.CACHE_STORE_HOST && process.env.CACHE_STORE_PORT) {
    return {
      store: store,
      host: process.env.CACHE_STORE_HOST,
      port: parseInt(process.env.CACHE_STORE_PORT, 10),
      isGlobal: true,
    };
  }
  return {
    isGlobal: true,
  };
};
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
    DataBaseModule,
    LoggerModule,
    UserModule,
    DeviceModule,
    AuthModule,
    DataBaseModule,
    ThrottlerModule.forRoot({
      ttl: 60 * 5, // 5 minutes
      limit: 300, // 300 limit
      ignoreUserAgents: [/googlebot/gi, /bingbot/gi, /baidubot/gi],
    }),
    ConfigModule.forRoot({
      load: [AppConfigLoader, LoggerConfigLoader],
      isGlobal: true,
    }),
    CacheModule.register(cacheRedisStore()),
    ChannelModule,
    ProgramModule,
    OperationLogModule,
    ConfigureModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
