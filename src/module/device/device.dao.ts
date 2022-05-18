import { LoggerService, PrismaService, Logger, PageInfoNumber } from '@/common';
import { DeviceLineStatus, DeviceLock } from '@/constant';
import { encryptedWithPbkdf2 } from '@/util';
import { Injectable } from '@nestjs/common';
import { Device } from '@prisma/client';
import { DeviceDTO } from './device.dto';

@Injectable()
export class DeviceDao {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private log4js: LoggerService,
  ) {
    this.logger = this.log4js.getLogger(DeviceDao.name);
  }

  async findDeviceById(deviceId: string) {
    this.logger.info('findDeviceById.deviceId >>', deviceId);
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

  upsertDevice(deviceId: string, userId: string) {
    this.logger.info(
      '[delUserOnDevice] deviceId >>',
      deviceId,
      'userId>>>',
      userId,
    );
    return this.prismaService.userOnDevice.upsert({
      create: {
        userId,
        deviceId,
      },
      update: {
        updatedAt: new Date().toISOString(),
      },
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
    });
  }

  insertUserOnDevice(deviceId: string, userId: string) {
    this.logger.info(
      '[insertUserOnDevice] deviceId >>',
      deviceId,
      'userId>>>',
      userId,
    );
    return this.prismaService.userOnDevice.create({
      data: {
        userId,
        deviceId,
      },
    });
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

  async updateDevice(device: DeviceDTO) {
    const result = this.prismaService.device.update({
      data: {
        isOnline: device.isOnline,
        os: device.os,
        engine: device.engine,
        isLocked: device.isLocked,
        accessTokenValidateSeconds: device.accessTokenValidateSeconds,
        refreshTokenValidateSeconds: device.refreshTokenValidateSeconds,
      },
      where: {
        id: device.id,
      },
      select: {
        id: true,
      },
    });
    this.logger.info('[updateDevice] updateDevice device successfully!!');
    return result;
  }

  async getDeviceById(id: string) {
    this.logger.info('[getDeviceById] id = %s', id);
    const deviceInfo = await this.prismaService.device.findUnique({
      where: {
        id,
      },
      include: {
        grants: {
          select: {
            grant: true,
          },
        },
      },
    });
    this.logger.info('[getDeviceById] getDeviceById successfully!!');
    return deviceInfo;
  }

  async getDeviceListForPage(
    pageSize: string,
    current: string,
  ): Promise<PageInfoNumber<Device[]>> {
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.device.findMany({
        take: +pageSize,
        skip: +current - 1,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.device.count(),
    ]);
    return {
      total,
      data,
      pageSize: +pageSize,
      pageNumber: +current,
    };
  }

  async batchDeleteDevice(deviceIdObj: { ids: string[] }) {
    await this.prismaService.$transaction([
      this.prismaService.grantOnDevice.deleteMany({
        where: {
          deviceId: {
            in: deviceIdObj.ids,
          },
        },
      }),
      this.prismaService.device.deleteMany({
        where: {
          id: {
            in: deviceIdObj.ids,
          },
        },
      }),
    ]);
    this.logger.info('[batchDeleteDevice] batchDeleteDevice successfully!!');
    return {};
  }
}
