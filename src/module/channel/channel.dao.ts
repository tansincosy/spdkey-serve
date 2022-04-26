import { Logger, LoggerService, PrismaService } from '@/common';
import { Injectable } from '@nestjs/common';
@Injectable()
export class ChannelDAO {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.getLogger(ChannelDAO.name);
  }
}
