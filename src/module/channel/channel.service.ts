import { ChannelConstant, ChannelReg } from './../../constant/channel.constant';
import { ParseUrlDTO } from './channel.dto';
import { Logger, LoggerService, BaseException } from '@/common';
import { Injectable } from '@nestjs/common';
import { ChannelDAO } from './channel.dao';
import { FileManagerService } from './file-manager.service';
import { BasicExceptionCode } from '@/constant';

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
    await this.fileMgrService.downloadFileFrom3rd(url, targetFileName);
    this.logger.info('begin parse .m3u file');
    const fileContent = this.fileMgrService.readFile(targetFileName);
    //TODO: 解析m3u文件，准备存入数据库

    const { channelList, epgXMLUrls } = this.getChannelInfoFromM3u(fileContent);

    if (Array.isArray(channelList) && Array.isArray(epgXMLUrls)) {
    }
  }

  async getChannelInfoFromM3u(fileContent: string) {
    const m3uContentReg = new RegExp(ChannelConstant.M3U_FLAG);

    if (!m3uContentReg.test(fileContent) || !fileContent) {
      this.logger.error(
        'download file is not a m3u file or file content is empty',
      );
      return {};
    }

    const channelInfoList = fileContent
      .split('\n')
      .filter((item) => item.startsWith(ChannelConstant.M3U_INFO_FLAG));

    const tvgXMLUrlStr = this.pickFromValue(fileContent, ChannelReg.TVG_URL, 1);
    const epgXMLUrls = tvgXMLUrlStr.split(',');
    //TODO: 需要转换XML数据
    const newChannelList = channelInfoList.map((channelItemStr: string) => {
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
    return {
      channelList: newChannelList,
      epgXMLUrls,
    };
  }

  private pickFromValue(content: string, rex: RegExp, valueIndex = 0) {
    const match = content.match(rex);
    if (Array.isArray(match) && match.length > valueIndex) {
      return match[valueIndex];
    }
    return '';
  }
}
