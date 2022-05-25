import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as store from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { HttpRequestMiddleware } from './middleware/http-request.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpSpendTimeInterceptor } from './interceptor/http-time.interceptor';
import { LoggerService } from './processor/log4j/log4j.service';
@Module({
  imports: [
    DataBaseModule,
    LoggerModule,
    UserModule,
    DeviceModule,
    AuthModule,
    DataBaseModule,
    ConfigModule.forRoot({
      load: [AppConfigLoader, LoggerConfigLoader],
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService, LoggerService],
      useFactory: async (config: ConfigService, log: LoggerService) => {
        const cacheConfig = config.get('cache');
        if (cacheConfig.host) {
          log.getLogger(CacheModule.name).info('user redis store');
          return {
            store,
            ...cacheConfig,
          };
        }
        log.getLogger(CacheModule.name).info('user local store');
        return {};
      },
    }),
    ChannelModule,
    ProgramModule,
    OperationLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: HttpSpendTimeInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(HttpRequestMiddleware).forRoutes('*');
  }
}
