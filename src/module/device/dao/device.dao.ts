import { Log4JService } from '@/common';
import { PrismaService } from '@/common/service/prisma.service';
import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';

@Injectable()
export class DeviceDao {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private log4js: Log4JService,
  ) {
    this.logger = this.log4js.getLogger(DeviceDao.name);
  }

  async findDeviceById(deviceId: string) {
    this.logger.info('[findDeviceById] deviceId >>', deviceId);
    const client = await this.prismaService.device.findFirst({
      where: {
        deviceId,
      },
      include: {
        grants: {
          include: {
            grant: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    this.logger.debug('[findDeviceById] client >>>', client);
    return client;
  }
}
