import { Logger, LoggerService, PrismaService } from '@/common';
import { Injectable } from '@nestjs/common';
import { M3uChannel, EpgUrl } from './channel.type';
@Injectable()
export class ChannelDAO {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.getLogger(ChannelDAO.name);
  }

  async batchAddChannelSource(channels: M3uChannel[]) {
    this.logger.info('begin batchAddChannels to db');
    await this.prismaService.channelSource.createMany({
      data: channels.map((item) => {
        return {
          name: item.name,
          channelId: item.channelId,
          logo: item.logo,
          playUrl: item.playUrl,
          country: item.country,
          language: item.language,
          m3UId: item.m3UId,
        };
      }),
      skipDuplicates: true,
    });
    this.logger.info('batchAddChannels successful');
  }

  findM3uNameUrlByUrl(url: string) {
    return this.prismaService.m3U.findFirst({
      where: {
        url,
      },
      select: {
        name: true,
      },
    });
  }

  saveM3uInfo(url: string, name: string) {
    return this.prismaService.m3U.upsert({
      where: {
        url,
      },
      update: {
        name,
      },
      create: {
        url,
        name,
      },
      select: {
        id: true,
      },
    });
  }

  batchAddEpgXMUrl(epgUrls: EpgUrl[]) {
    return this.prismaService.ePGUrl.createMany({
      data: epgUrls.map(({ name, url }) => {
        return {
          url,
          name,
        };
      }),
      skipDuplicates: true,
    });
  }

  getAllEpgXmlUrl() {
    return this.prismaService.ePGUrl.findMany({});
  }
}
