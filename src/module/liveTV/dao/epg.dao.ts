import { Logger, LoggerService, PrismaService } from '@/common';
import { Injectable } from '@nestjs/common';
@Injectable()
export class EPGDao {
  private log: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.log = this.logger.getLogger(EPGDao.name);
  }

  async saveChannel(channels) {
    this.log.debug('[saveChannel] channels>>>', channels);
    await this.prismaService.channel.createMany({
      data: channels,
    });
    this.log.info('[saveChannel] save successfully >>>');
  }

  async saveProgram(programs) {
    await this.prismaService.program.createMany({
      data: programs,
    });
  }

  async getProgramsByChannelId(channelId) {
    await this.prismaService.program.findMany({
      where: {
        channelId: channelId,
      },
    });
  }
}
