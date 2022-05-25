import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { TMDBErrorCode } from '@/constant/tmdb.constant';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import { BaseException } from '@/exception/base.exception';
@Injectable()
export class MyHttpService {
  private logger: Logger;
  constructor(
    private readonly httpService: HttpService,
    private lo4js: LoggerService,
  ) {
    this.logger = this.lo4js.getLogger('TMDBService');
  }

  async get<T>(url: string, params?: any): Promise<T> {
    try {
      this.logger.info('url>>>', url);
      const { data } = await this.httpService.get(url, params).toPromise();
      if (data) {
        return data;
      }
      return {} as T;
    } catch (e) {
      this.logger.error(e);
      if (!e.response) {
        // Request was made but there was no response
        throw new BaseException(TMDBErrorCode.CONNECTED_ERROR);
      }

      const { config, status, statusText } = (e as AxiosError).response;
      if (config) {
        const { method, url, headers } = config;
        const startTime = headers['request-startTime'];
        this.logger.error({
          service: 'HTTP Service',
          method,
          url,
          startTime,
          status,
          statusText,
        });
      }
      if (status === 401) {
        // Invalid API Key Error
        this.logger.error('TMDB Invalid API Key Error');
        throw new BaseException(TMDBErrorCode.INVALID_API);
      }
      if (status === 404) {
        // Resource not found error
        this.logger.error('source not found');
        throw new BaseException(TMDBErrorCode.SOURCE_NOT_FOUND);
      }
      if (500 <= status) {
        // TMDB Server Error
        throw new BaseException(TMDBErrorCode.SERVER_ERROR);
      }
    }
  }
}
