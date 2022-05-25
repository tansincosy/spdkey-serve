import { PrismaService } from '@/processor/database/prisma.service';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import { getOrderBy } from '@/util';
import { Injectable } from '@nestjs/common';
import { M3uChannel, EpgUrl, EpgChannel } from './channel.type';
@Injectable()
export class ChannelDAO {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.getLogger(ChannelDAO.name);
  }

  /**
   * 节目单数据源
   * @param channels
   */
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

  getSearchParam(search) {
    let searchResult: any = {};
    searchResult = {
      ...search,
    };
    if (search.status) {
      searchResult.status = +search.status;
    }
    if (searchResult.name) {
      searchResult.name = {
        contains: search.name,
      };
    }
    return searchResult;
  }

  async getChannelSources(
    pageSize = 20,
    current = 1,
    createdAt?: any,
    updatedAt?: any,
    search?: M3uChannel,
  ) {
    const orderBy = getOrderBy(createdAt, updatedAt);
    this.logger.info(
      'begin getChannelSources to db pageSize = %s,current = %s',
      pageSize,
      current,
      'search = ',
      search,
    );

    const searchParam = this.getSearchParam(search);

    return this.prismaService.$transaction([
      this.prismaService.channelSource.findMany({
        take: pageSize,
        skip: current - 1,
        orderBy: {
          ...orderBy,
        },
        where: {
          ...searchParam,
        },
      }),
      this.prismaService.channelSource.count({
        where: {
          ...searchParam,
        },
      }),
    ]);
  }

  batchDel(ids: string[]) {
    return this.prismaService.channelSource.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  getChannels() {
    return this.prismaService.channelSource.findMany({});
  }

  async getEpgXmlChannels(
    pageSize = 20,
    current = 1,
    createdAt?: any,
    updatedAt?: any,
    search?: EpgChannel,
  ) {
    const orderBy = getOrderBy(createdAt, updatedAt);
    const searchParam = this.getSearchParam(search);
    return this.prismaService.$transaction([
      this.prismaService.ePGSourceChannel.findMany({
        take: pageSize,
        skip: current - 1,
        orderBy: {
          ...orderBy,
        },
        where: {
          ...searchParam,
        },
      }),
      this.prismaService.ePGSourceChannel.count({
        where: {
          ...searchParam,
        },
      }),
    ]);
  }
}
