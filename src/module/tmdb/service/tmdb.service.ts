import { LoggerService, Logger } from '@/common';
import { JSON2Object } from '@/util';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { MovieDetails, SeasonDetail, TvShowDetails } from '../interface';
import { Config, Credit, SourceType } from '../interface/params';
import { Image } from '../interface/params';
import { MyHttpService } from './my-http-service.service';

@Injectable()
export class TMDBService {
  private logger: Logger;
  private apiKey: string;
  constructor(
    private lo4js: LoggerService,
    private httpService: MyHttpService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {
    this.logger = this.lo4js.getLogger(TMDBService.name);
    this.apiKey = this.configService.get<string>('tmdb.apiKey');
    this.logger.debug('apiKey', this.apiKey);
  }

  async getConfig(configType: Config) {
    let requestUrl = '';
    switch (configType) {
      case Config.image:
        requestUrl = `/configuration`;
        break;
      case Config.countries:
        requestUrl = `/configuration/countries`;
        break;
      case Config.timezones:
        requestUrl = `/configuration/timezones`;
        break;
      case Config.translation:
        requestUrl = `/configuration/primary_translations`;
        break;
      case Config.languages:
        requestUrl = `configuration/languages`;
        break;
      default:
        break;
    }
    this.logger.info('[getConfig]requestUrl>>>', requestUrl);
    const cacheConfigObj = await this.cache.get<string>(`tmdb:${configType}`);
    if (cacheConfigObj) {
      return JSON2Object(cacheConfigObj);
    }
    const configObj = await this.httpService.get<any>(requestUrl, {
      params: {
        api_key: this.apiKey,
      },
    });

    await this.cache.set(`tmdb:${requestUrl}`, JSON.stringify(configObj));
    this.logger.info('configList>>>', configObj);

    return configObj;
  }
  /**
   * 根据id获取详情
   * @param movieId
   * @returns
   */
  async getMovieById(movieId: string) {
    const movieInfo = await this.httpService.get<MovieDetails>(
      `/movie/${movieId}`,
      {
        params: {
          api_key: this.apiKey,
          language: 'zh-CN',
        },
      },
    );
    this.logger.debug('[getMovieById]movieInfo>>>', movieInfo);
    return movieInfo;
  }

  async getSeasonDetail(tvId: number, seasonNumber: number) {
    const tvGroups = await this.httpService.get<SeasonDetail>(
      `/tv/${tvId}/season/${seasonNumber}`,
      {
        params: {
          api_key: this.apiKey,
          language: 'zh-CN',
        },
      },
    );
    this.logger.debug('[getMovieById]tvEpisodeGroups>>>', tvGroups);
    return tvGroups;
  }

  async getTVById(tvId: string) {
    const tvInfo = await this.httpService.get<TvShowDetails>(`/tv/${tvId}`, {
      params: {
        api_key: this.apiKey,
        language: 'zh-CN',
      },
    });
    this.logger.debug('[getTVById]tvInfo>>>', tvInfo);
    return tvInfo;
  }

  async getCredit(movieId: string, type: SourceType): Promise<Credit> {
    const requestUrl =
      type === SourceType.tv
        ? `/tv/${movieId}/credits`
        : `/movie/${movieId}/credits`;
    const crews = await this.httpService.get<Credit>(requestUrl, {
      params: {
        api_key: this.apiKey,
        language: 'zh-CN',
      },
    });
    this.logger.debug('[getCredit]crews>>>', crews);
    return crews;
  }

  async getImage(movieId: string, imageType: SourceType) {
    const requestUrl =
      imageType === SourceType.tv
        ? `/tv/${movieId}/images`
        : `/movie/${movieId}/images`;
    const imgs = await this.httpService.get<Image>(requestUrl, {
      params: {
        api_key: this.apiKey,
      },
    });

    this.logger.debug('[getCredit]tvInfo>>>', imgs);
    return imgs;
  }

  async searchSource(queryKey: string, sourceType: SourceType) {
    const requestUrl =
      sourceType === SourceType.tv ? `/search/tv` : `/search/movie`;
    this.logger.info('[searchSource]requestUrl>>>', requestUrl);
    const data = await this.httpService.get(requestUrl, {
      params: {
        api_key: this.apiKey,
        language: 'zh-CN',
        query: queryKey,
      },
    });
    const config = await this.getConfig(Config.image);
    this.logger.debug('[getCredit]searchSource>>>', data);
    return {
      data,
      config,
    };
  }
}
