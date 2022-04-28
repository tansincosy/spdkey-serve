import { ParseUrlDTO } from './channel.dto';
import { Logger, LoggerService, BaseException } from '@/common';
import { Injectable } from '@nestjs/common';
import { ChannelDAO } from './channel.dao';
import { FileManagerService } from './file-manager.service';
import { BasicExceptionCode, ChannelConstant, ChannelReg } from '@/constant';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readdirSync } from 'fs';
import { ChannelSource } from '@prisma/client';
import { arrayHasItem } from '@/util';
import { XMLParser } from 'fast-xml-parser';
import { isObject } from 'lodash';

const execPromise = promisify(exec);
@Injectable()
export class ChannelService {
  private logger: Logger;
  constructor(
    private readonly channelDAO: ChannelDAO,
    private readonly loggerService: LoggerService,
    private readonly fileMgrService: FileManagerService,
  ) {
    this.logger = this.loggerService.getLogger(ChannelService.name);
  }

  async parseM3uUrl(parseUrl: ParseUrlDTO) {
    const { url } = parseUrl;
    const targetFileName = `./tmp/channel.source/${url
      .split('/')
      .pop()}.channel.source.m3u`;
    this.logger.info('begin download url= %s ', url);
    await execPromise(`sh scripts/download.sh  ${url} ${targetFileName}`);

    this.logger.info('begin parse .m3u file');
    if (!existsSync(targetFileName)) {
      this.logger.error('download .m3u file failed');
      throw new BaseException(BasicExceptionCode.DOWNLOAD_FILE_FAILED);
    }

    const fileContent = await this.fileMgrService.readFile(targetFileName);
    const { channelTagStrs, tvgXMLUrlStr } = await this.getChannelInfoFromM3u(
      fileContent,
    );

    const channelSources = this.parseJSONForChannels(
      channelTagStrs,
    ) as ChannelSource[];

    await this.channelDAO.batchAddChannels(channelSources);

    await execPromise(`sh scripts/download_programs.sh ${tvgXMLUrlStr}`);
    this.logger.info('download program epg xml file success');

    const programsUrls: string[] = tvgXMLUrlStr.split(',');

    // 读取xml 文件
    if (!existsSync(targetFileName)) {
      this.logger.error('download .m3u file failed');
      throw new BaseException(BasicExceptionCode.DOWNLOAD_FILE_FAILED);
    }

    if (Array.isArray([])) {
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
      .split('\n')
      .filter((item) => item.startsWith(ChannelConstant.M3U_INFO_FLAG));

    const tvgXMLUrlStr = this.pickFromValue(fileContent, ChannelReg.TVG_URL, 1);

    return {
      channelTagStrs,
      tvgXMLUrlStr,
    };
  }

  async beginDownloadEpgProgramXml() {
    await execPromise('sh scripts/download.sh');
  }

  private async parseJSONForProgram(programs: string[]) {
    const programChannelSources: string[] = readdirSync('tmp/program.source');
    const xmlParser = new XMLParser({
      ignoreAttributes: false,
    });

    let channelSources = await this.channelDAO.getAllXmlFiles();
    //过滤出频道节目单中的频道
    channelSources = channelSources.filter((item) => {
      return programChannelSources.find(
        (sourceFileName) => sourceFileName === item.name,
      );
    });

    if (arrayHasItem(channelSources)) {
      //TODO: 准备存入数据，定义 结构类型
      const allSourceChannels = channelSources.reduce(
        async (total: any, sourceItem) => {
          const fileContent = await this.fileMgrService.readFile(
            `tmp/program.source/${sourceItem.name}`,
          );
          const xmlJsonContent = xmlParser.parse(fileContent);
          if (xmlJsonContent?.tv?.channel) {
            const channelObj = xmlJsonContent?.tv?.channel;
            if (arrayHasItem(channelObj)) {
              const channelObjs = channelObj.map((channelItem) => {
                return {
                  channelId: channelItem['@_id'],
                  name: channelItem['@_display_name'],
                  programUrlId: sourceItem.programUrlId,
                };
              });
              return [...total, ...channelObjs];
            }
            if (isObject(channelObj)) {
              const channelObjItem = {
                channelId: channelObj['@_id'],
                name: channelObj['@_display_name'],
                programUrlId: sourceItem.programUrlId,
              };
              return [...total, channelObjItem];
            }
          }
          return total;
        },
        [],
      );
    }
  }

  private parseJSONForChannels(channels: string[]) {
    return channels.map((channelItemStr: string) => {
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
        2,
      );

      return {
        channelId,
        logo,
        name,
        language,
        country,
        playUrl,
      };
    });
  }

  private pickFromValue(content: string, rex: RegExp, valueIndex = 0) {
    const match = content.match(rex);
    if (Array.isArray(match) && match.length > valueIndex) {
      return match[valueIndex];
    }
    return '';
  }
}
