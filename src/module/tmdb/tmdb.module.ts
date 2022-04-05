import { Logger, LoggerService } from '@/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TMDBConfig } from './interface/params';
import { MyHttpService } from './service/my-http-service.service';
import { TMDBService } from './service/tmdb.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService, LoggerService],
      useFactory(configService: ConfigService, log4js: LoggerService) {
        const { baseURL, timeout } = configService.get<TMDBConfig>('tmdb');
        log4js
          .getLogger(TMDBModule.name)
          .info('[HttpModule] TMDBConfig>>>', baseURL, 'timeout>>>', timeout);
        return { baseURL, timeout: +timeout };
      },
    }),
  ],
  providers: [TMDBService, MyHttpService],
  exports: [TMDBService, MyHttpService],
})
@Global()
export class TMDBModule implements OnModuleInit {
  private logger: Logger;

  constructor(private httpService: HttpService, private lo4js: LoggerService) {
    this.logger = this.lo4js.getLogger(TMDBModule.name);
  }

  onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use((requestInstance) => {
      this.logger.info('[onModuleInit] url>>>', requestInstance.url);
      return requestInstance;
    });
  }
}
