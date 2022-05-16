import { M3UService } from './channel.m3u.service';
import {
  QueryChannelSourceDTO,
  QueryChannelDTO,
  ChannelQueryDTO,
} from './channel.dto';
import { Logger, LoggerService, BaseException, DeleteIdPrams } from '@/common';
import { Injectable } from '@nestjs/common';
import { ChannelDAO } from './channel.dao';
import { BasicExceptionCode } from '@/constant';
import { moreThOne } from '@/util';

@Injectable()
export class ChannelService {
  private logger: Logger;
  private downloading = false;
  constructor(
    private readonly channelDAO: ChannelDAO,
    private readonly loggerService: LoggerService,
    private readonly m3UService: M3UService,
  ) {
    this.logger = this.loggerService.getLogger(ChannelService.name);
  }

  OnModuleInit() {
    this.logger.info('ChannelService init');
    this.downloading = false;
  }

  async getM3uUrl(query: QueryChannelSourceDTO) {
    const { current, pageSize, updatedAt, createdAt, ...restParams } = query;

    this.logger.info('getM3uUrl  current,', current, 'pageSize', pageSize);
    const [data, total] = await this.channelDAO.getChannelSources(
      pageSize && +pageSize,
      current && +current,
      createdAt,
      updatedAt,
      restParams,
    );
    return {
      data,
      pageSize: query.pageSize,
      current: query.current,
      total,
    };
  }

  async batchDelete(idObj: DeleteIdPrams) {
    const { ids } = idObj;
    await this.channelDAO.batchDel(ids);
    this.logger.info('batch delete success ids = ', ids);
    return {};
  }

  async getProgramChannel(query: QueryChannelSourceDTO) {
    const { current, pageSize, updatedAt, createdAt, ...restParams } = query;
    this.logger.info(
      'getProgramChannel  current,',
      current,
      'pageSize',
      pageSize,
    );
    const [data, total] = await this.channelDAO.getEpgXmlChannels(
      pageSize && +pageSize,
      current && +current,
      createdAt,
      updatedAt,
      restParams,
    );
    return {
      data,
      pageSize: query.pageSize,
      current: query.current,
      total,
    };
  }
  /**
   * 下载进度
   * @returns
   */
  getDownloadedPercent() {
    return {
      data: {
        downloadPercent: this.m3UService.getDownloadedPercent,
      },
    };
  }

  async contrSourceChannelData(m3uUrl: string, isForceUpdate: boolean) {
    if (isForceUpdate) {
      await this.m3UService.deleteM3uRecord(m3uUrl);
    }

    if (this.downloading) {
      this.logger.warn('contrSourceChannelData downloading,so do not download');
      throw new BaseException(BasicExceptionCode.HAS_TASK_DOWNLOADING);
    }
    const m3uInfo = await this.m3UService.findM3uByUrl(m3uUrl);
    if (m3uInfo.name) {
      const isExist = this.m3UService.isExistM3uByName(m3uInfo.name);
      if (!isExist) {
        m3uInfo.name = await this.m3UService
          .downloadM3U(m3uUrl)
          .catch((error) => {
            this.logger.error('download m3u error = ', error);
            throw new BaseException(BasicExceptionCode.DOWNLOAD_FILE_FAILED);
          });
        const saveResult = await this.m3UService.saveM3UInfoData(
          m3uInfo.name,
          m3uUrl,
        );
        m3uInfo.id = saveResult.id;
      }
    } else {
      m3uInfo.name = await this.m3UService
        .downloadM3U(m3uUrl)
        .catch((error) => {
          this.logger.error('download m3u error = ', error);
          throw new BaseException(BasicExceptionCode.DOWNLOAD_FILE_FAILED);
        });
    }

    const { m3uSourceData, epgXmlData } = await this.m3UService.parseM3u(
      m3uInfo.name,
    );
    if (m3uSourceData.length > 0) {
      this.logger.info('begin save m3u data');
      const channels = this.m3UService.m3uChannelToJson(m3uSourceData);
      await this.m3UService.batchAddChannelSource(
        channels.map((channelSourceItem) => ({
          ...channelSourceItem,
          m3UId: m3uInfo.id,
        })),
      );
      const channelSources = await this.m3UService.getAllM3U();
      this.logger.info('begin download channel logo');
      this.m3UService.downloadChannelLogo(channelSources).then((resp) => {
        this.logger.log('download logo successful,filename = %s', resp);
      });
    }
    if (epgXmlData) {
      const epgUrls = epgXmlData.split(',') || [];
      this.m3UService.downloadEPGXML(epgUrls).then(async (epgFiles) => {
        this.logger.info('download all epg xml file successfully');
        await this.m3UService.batchAddEpgXMUrl(epgFiles);
        const programChannels = await this.m3UService.parseJSONForProgram(
          epgFiles,
        );
        this.logger.info('end download epg.xml');
        if (moreThOne(programChannels)) {
          this.logger.info(
            'download epg xml file successful,filename = %s',
            programChannels,
          );
          await this.m3UService.batchAddEpgXmlChannels(programChannels);
          this.logger.info('batch save batchAddEpgXmlChannels success');
        }
        this.downloading = false;
      });
    }
    return {};
  }

  getChannels({ name }: ChannelQueryDTO) {
    return [];
  }
}
