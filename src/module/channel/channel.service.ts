import { ParseUrlDTO } from './channel.dto';
import { Logger, LoggerService, BaseException } from '@/common';
import { Injectable } from '@nestjs/common';
import { ChannelDAO } from './channel.dao';
import { FileManagerService } from './file-manager.service';
import { BasicExceptionCode, ChannelConstant, ChannelReg } from '@/constant';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { getNameByUrl, moreThOne } from '@/util';
import { XMLParser } from 'fast-xml-parser';
import { isObject } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { CommonConfig } from '@/config';
import { resolve } from 'path';
import * as dayjs from 'dayjs';

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

  beginDownloadFile(url: string, fileName: string) {
    this.logger.info(
      'begin download file, url =%s,fileName= %s',
      url,
      fileName,
    );
    return execPromise(`sh scripts/download.sh ${url} ${fileName}`);
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
    await execPromise(
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
      'begin download needDownload= %s ,fileName = %s',
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

    const epgUrls = tvgXMLUrlStr.split(',') || [];
    const batchAddEpgUrls = epgUrls.map((url) => {
      const name = getNameByUrl(url);
      return {
        url,
        name,
      };
    });

    await this.channelDAO.batchAddEpgXMUrl(batchAddEpgUrls);
    const programChannels = await this.parseJSONForProgram();

    if (moreThOne(programChannels)) {
      // await this.channelDAO.batchAddChannelProgram(programChannels);
    }

    const programsUrls: string[] = tvgXMLUrlStr.split(',');

    // 读取xml 文件
    if (!existsSync(targetFileName)) {
      this.logger.error('download .m3u file failed');
      throw new BaseException(BasicExceptionCode.DOWNLOAD_FILE_FAILED);
    }
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

    // await this.batchDownloadProgram(tvgXMLUrlStr, appConfig.programXMLPath);

    const epgXMLFiles: string[] = readdirSync(appConfig.programXMLPath);
    const xmlParser = new XMLParser({
      ignoreAttributes: false,
    });

    const epgUrls = await this.channelDAO.getAllEpgXmlUrl();
    //过滤出频道节目单中的频道
    const allowEPGs = epgUrls.filter((epgUrl) => {
      return epgXMLFiles.find((epgFileName) => epgFileName === epgUrl.name);
    });

    if (moreThOne(allowEPGs)) {
      await execPromise('sh scripts/merge_xml.sh');

      this.logger.info('merge xml success!!');

      //准备存入数据，定义 结构类型
      // const allSourceChannels = allowEPGs.reduce<
      //   | {
      //       channelId: string;
      //       name: string;
      //       programUrlId: string;
      //     }[]
      // >((total: any, sourceItem) => {
      //   console.time();
      //   console.log(sourceItem.name);
      //   const fileContent = readFileSync(
      //     `${appConfig.programXMLPath}/${sourceItem.name}`,
      //     'utf-8',
      //   );
      //   console.timeEnd();
      //   const xmlJsonContent = xmlParser.parse(fileContent);
      //   if (xmlJsonContent?.tv?.channel) {
      //     const channelObj = xmlJsonContent?.tv?.channel;
      //     if (moreThOne(channelObj)) {
      //       const channelObjs = channelObj.map((channelItem) => {
      //         return {
      //           channelId: channelItem['@_id'],
      //           name: channelItem['display-name'],
      //           programUrlId: sourceItem.url,
      //         };
      //       });
      //       return [...total, ...channelObjs];
      //     }
      //     if (isObject(channelObj)) {
      //       const channelObjItem = {
      //         channelId: channelObj['@_id'],
      //         name: channelObj['display-name'],
      //         programUrlId: sourceItem.id,
      //       };
      //       return [...total, channelObjItem];
      //     }
      //   }
      //   return total;
      // }, []);
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
}
