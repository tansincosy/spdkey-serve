import { Log4JService } from '@/common';
import { PrismaService } from '@/common/service/prisma.service';
import { encryptedWithPbkdf2 } from '@/util';
import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { DeviceLineStatus, DeviceLock } from '../types/constant';
import { DeviceDTO } from '../types/device';

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

  async findUserDeviceByClientIdAndUserId(deviceId: string, userId: string) {
    this.logger.info(
      '[findUserDeviceByClientIdAndUserId] deviceId >>',
      deviceId,
      'userId>>>',
      userId,
    );
    const hasUserLinkClient = await this.prismaService.device.findFirst({
      where: {
        deviceId,
        userId,
      },
    });
    this.logger.debug(
      '[findUserDeviceByClientIdAndUserId] hasUserLinkClient >>>',
      hasUserLinkClient,
    );
    return hasUserLinkClient;
  }

  async saveDeviceLinkUserWithClientIdAndUserId(
    deviceId: string,
    userId: string,
  ) {
    this.logger.info(
      '[saveDeviceLinkUserWithClientIdAndUserId] deviceId >>',
      deviceId,
      'userId>>>',
      userId,
    );
    await this.prismaService.device.create({
      data: {
        deviceId,
        userId,
      },
    });
    this.logger.info(
      '[saveDeviceLinkUserWithClientIdAndUserId] save successFully',
    );
  }

  async saveDevice(device: DeviceDTO) {
    this.logger.info('[saveDevice] device = %s', device);
    const deviceSecret = await encryptedWithPbkdf2(device.deviceId);
    const clientResult = await this.prismaService.device.create({
      data: {
        name: device.name,
        deviceId: device.deviceId,
        os: device.os,
        type: device.type,
        engine: device.engine,
        isOnline: DeviceLineStatus.ONLINE,
        isLocked: DeviceLock.UN_LOCKED,
        deviceSecret,
      },
      select: {
        id: true,
        deviceSecret: true,
      },
    });
    return clientResult;
  }

  async saveGrant(...grants: string[]) {
    await this.prismaService.grant.createMany({
      data: grants.map((item) => {
        return {
          name: item,
        };
      }),
      skipDuplicates: true,
    });
    this.logger.info('[saveGrant] save grant successfully!!');
  }

  async findGrantsByName(...names: string[]) {
    const grants = await this.prismaService.grant.findMany({
      where: {
        name: {
          in: names,
        },
      },
      select: {
        id: true,
      },
    });
    this.logger.debug('[findGrantsByName]::: grant :::', grants);
    return grants;
  }

  async saveGrantOnDevice(deviceId: string, ...grantIds: { id: string }[]) {
    await this.prismaService.grantOnDevice.createMany({
      data: grantIds.map((grantId) => {
        return {
          grantId: grantId.id,
          deviceId,
        };
      }),
      skipDuplicates: true,
    });
    this.logger.info('[saveGrantOnDevice] save grant on device successfully!!');
  }
}
