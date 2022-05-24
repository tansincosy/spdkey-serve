import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  AuthModule,
  ChannelModule,
  ConfigureModule,
  DeviceModule,
  OperationLogModule,
  ProgramModule,
  UserModule,
} from '@/module';
import { CommonModule, HttpRequestMiddleware } from '@/common';
import { AppConfigModule } from './config';
import { AppCacheModule } from './cache/cache.module';

@Module({
  imports: [
    CommonModule,
    AppConfigModule,
    AppCacheModule,
    UserModule,
    DeviceModule,
    AuthModule,
    ConfigureModule,
    ChannelModule,
    ProgramModule,
    OperationLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(HttpRequestMiddleware).forRoutes('*');
  }
}
