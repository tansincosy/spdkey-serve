import { Logger, LoggerService, PrismaService } from '@/common';
import { Injectable } from '@nestjs/common';
import { ChannelSource } from '@prisma/client';
@Injectable()
export class ChannelDAO {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.getLogger(ChannelDAO.name);
  }

  async batchAddChannels(channels: ChannelSource[]) {
    this.logger.info('begin batchAddChannels to db');
    await this.prismaService.channelSource.createMany({
      data: channels,
    });
    this.logger.info('batchAddChannels successful');
  }

  getAllXmlFiles() {
    return this.prismaService.programChannel.findMany({});
  }
}
