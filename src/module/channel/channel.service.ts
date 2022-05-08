import { DelIdDTO, ParseUrlDTO, QueryChannelSourceDTO } from './channel.dto';
import { Logger, LoggerService, BaseException } from '@/common';
import { Injectable } from '@nestjs/common';
import { ChannelDAO } from './channel.dao';
import { FileManagerService } from './file-manager.service';
import { BasicExceptionCode, ChannelConstant, ChannelReg } from '@/constant';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { convertPrismaSort, getNameByUrl, moreThOne } from '@/util';
import { ConfigService } from '@nestjs/config';
import { CommonConfig } from '@/config';
import { resolve } from 'path';
import * as dayjs from 'dayjs';
import { EpgChannel } from './channel.type';

const execPromise = promisify(exec);
@Injectable()
export class ChannelService {
  private logger: Logger;
  constructor(
    private readonly channelDAO: ChannelDAO,
    private readonly loggerService: LoggerService,
    private readonly fileMgrService: FileManagerService,
    private readonly configService: ConfigService,
  ) {
    this.logger = this.loggerService.getLogger(ChannelService.name);
  }

  async beginDownloadFile(url: string, fileName: string) {
    this.logger.info(
      'begin download file, url =%s,fileName= %s',
      url,
      fileName,
    );
    const { stdout } = await execPromise(
      `sh scripts/download.sh ${url} ${fileName}`,
    );
    this.logger.info('cmd result  stdout = ', stdout);
  }
  /**
   *  判断是否要下载
   * @param url
   * @returns
   */
  async isCanDownloadFile(url: string) {
    const { name } = (await this.channelDAO.findM3uNameUrlByUrl(url)) || {};
    const appConfig = this.configService.get<CommonConfig>('appConfig');
    if (name) {
      const hasBeenDownloadFile = resolve(appConfig.m3uPath, name);
      const pathHasFile = existsSync(hasBeenDownloadFile);
      if (!pathHasFile) {
        return {
          needDownload: true,
          fileName: hasBeenDownloadFile,
        };
      }
      return {
        needDownload: false,
        fileName: hasBeenDownloadFile,
      };
    }
    const fileName = getNameByUrl(url);
    const targetFileName = `${resolve(
      appConfig.m3uPath,
      dayjs().format('YYYY-MM-DD_HH-mm-ss') + `.${fileName}`,
    )}`;
    return {
      needDownload: true,
      fileName: targetFileName,
    };
  }

  async batchDownloadProgram(tvgXMLUrlStr: string, programXMLPath: string) {
    return execPromise(
      `sh scripts/batch_download.sh ${tvgXMLUrlStr} ${programXMLPath}`,
    );
  }

  // 根据地址下载 -> 将文件名存储数据库，-> 解析.m3u文件 -> 解析.xml文件 -> 将数据存储数据库

  async parseM3uUrl(parseUrl: ParseUrlDTO) {
    const { url } = parseUrl;
    const { needDownload, fileName } = await this.isCanDownloadFile(url);
    if (needDownload) {
      await this.beginDownloadFile(url, fileName);
    }
    this.logger.debug(
      'end download needDownload= %s ,fileName = %s',
      needDownload,
      fileName,
    );
    this.logger.info('begin parse .m3u file');
    if (!existsSync(fileName)) {
      this.logger.error('download .m3u file failed');
      throw new BaseException(BasicExceptionCode.DOWNLOAD_FILE_FAILED);
    }
    const targetFileName = getNameByUrl(fileName);
    //获取m3u Id
    const { id } = await this.channelDAO.saveM3uInfo(url, targetFileName);
    this.logger.info('save m3u info success');

    //读取文件内容
    const fileContent = await this.fileMgrService.readFile(fileName);
    const { channelTagStrs, tvgXMLUrlStr } = await this.getChannelInfoFromM3u(
      fileContent,
    );

    const channelSources = this.parseJSONForChannels(channelTagStrs);

    await this.channelDAO.batchAddChannelSource(
      channelSources.map((channelSourceItem) => ({
        ...channelSourceItem,
        m3UId: id,
      })),
    );

    this.logger.info('begin batchAddEpgXMUrl process');
    const epgUrls = tvgXMLUrlStr.split(',') || [];
    const batchAddEpgUrls = epgUrls.map((url) => {
      const name = getNameByUrl(url);
      return {
        url,
        name,
      };
    });

    await this.channelDAO.batchAddEpgXMUrl(batchAddEpgUrls);
    this.logger.info('end batchAddEpgXMUrl process');
    const appConfig = this.configService.get<CommonConfig>('appConfig');
    this.logger.info('begin download epg.xml');
    await this.batchDownloadProgram(tvgXMLUrlStr, appConfig.programXMLPath);
    const programChannels = await this.parseJSONForProgram();
    this.logger.info('end download epg.xml');

    if (moreThOne(programChannels)) {
      await this.channelDAO.batchAddEpgXmlChannels(programChannels);
      this.logger.info('batch save batchAddEpgXmlChannels success');
    }
    return {};
  }

  /**
   * 从m3u 文件获取频道节目单信息
   * @param fileContent
   * @returns
   */
  async getChannelInfoFromM3u(fileContent: string) {
    const m3uContentReg = new RegExp(ChannelConstant.M3U_FLAG);

    if (!m3uContentReg.test(fileContent) || !fileContent) {
      this.logger.error(
        'download file is not a m3u file or file content is empty',
      );
      return {};
    }

    const channelTagStrs = fileContent
      .split(ChannelConstant.M3U_INFO_FLAG)
      .filter((item) => !item.startsWith(ChannelConstant.M3U_FLAG));

    const tvgXMLUrlStr = this.pickFromValue(fileContent, ChannelReg.TVG_URL, 1);

    return {
      channelTagStrs,
      tvgXMLUrlStr,
    };
  }

  async beginDownloadEpgProgramXml() {
    await execPromise('sh scripts/download.sh');
  }

  private async parseJSONForProgram() {
    const appConfig = this.configService.get<CommonConfig>('appConfig');

    const epgXMLFiles: string[] = readdirSync(appConfig.programXMLPath);

    const epgUrls = await this.channelDAO.getAllEpgXmlUrl();
    //过滤出频道节目单中的频道
    const allowEPGs = epgUrls.filter((epgUrl) => {
      return epgXMLFiles.find((epgFileName) => epgFileName === epgUrl.name);
    });

    if (moreThOne(allowEPGs)) {
      const { stdout } = await execPromise(
        `sh scripts/merge_xml.sh ${appConfig.allowChannelPath}`,
      );

      this.logger.info('merge xml success!! stdout=', stdout);

      const fileContent = readFileSync(
        `${appConfig.allowChannelPath}/${stdout.trim()}`,
        'utf-8',
      );
      if (fileContent) {
        const channelEpgs = fileContent.split('</channel').map((item) => {
          const [, fileName] = item.match(/tmp\/program\/(.*):<channel/) || [];
          const [, channelId, name, logo, url] =
            item.match(
              /<channel id="(.*)"><display-name>(.*)<\/display-name>.*?<icon src="(.*)"\/>.*?<url>(.*)<\/url>/,
            ) || [];
          const allowEPG = allowEPGs.find((epg) => epg.name === fileName);
          return {
            epgUrlId: allowEPG?.id,
            channelId,
            name,
            logo,
            url,
          };
        }) as EpgChannel[];

        return channelEpgs;
      }
      return [];
    }
    return [];
  }

  private parseJSONForChannels(channels: string[]) {
    return channels
      .map((channelItemStr: string) => {
        const channelId = this.pickFromValue(
          channelItemStr,
          ChannelReg.TVG_ID,
          1,
        );

        const logo = this.pickFromValue(channelItemStr, ChannelReg.TVG_LOGO, 1);
        const name = this.pickFromValue(
          channelItemStr,
          ChannelReg.TVG_CHANNEL_NAME,
          1,
        );
        const language = this.pickFromValue(
          channelItemStr,
          ChannelReg.TVG_LANGUAGE,
          1,
        );
        const country = this.pickFromValue(
          channelItemStr,
          ChannelReg.TVG_COUNTRY,
          1,
        );

        const playUrl = this.pickFromValue(
          channelItemStr,
          ChannelReg.TVG_PLAY_URL,
          0,
        );

        return {
          channelId,
          logo,
          name,
          language,
          country,
          playUrl,
        };
      })
      .filter((chan) => chan.name);
  }

  private pickFromValue(content: string, rex: RegExp, valueIndex = 0) {
    const match = content.match(rex);

    if (Array.isArray(match) && match.length > valueIndex) {
      return match[valueIndex];
    }
    return '';
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

  async batchDelete(idObj: DelIdDTO) {
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
}
