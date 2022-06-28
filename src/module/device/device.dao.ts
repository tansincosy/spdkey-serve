import { DeviceLineStatus, DeviceLock } from '@/constant/device.constant';
import { Pagination, QueryPagination } from '@/interface/page-info.interface';
import { PrismaOauthService } from '@/processor/database/prisma.service.oauth';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import {
  encryptedWithPbkdf2,
  excludePagination,
  generateQueryParam,
  likeQuery,
} from '@/util';
import { Injectable } from '@nestjs/common';
import { DeviceDTO, DeviceParams } from './device.dto';
import { OAuthClientDetails } from '@dva_oauth/prisma/client';

@Injectable()
export class DeviceDao
  implements QueryPagination<DeviceParams, OAuthClientDetails>
{
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaOauthService,
    private log4js: LoggerService,
  ) {
    this.logger = this.log4js.getLogger(DeviceDao.name);
  }

  upsertDevice(deviceId: string, userId: string) {
    // this.logger.info(
    //   '[delUserOnDevice] deviceId >>',
    //   deviceId,
    //   'userId>>>',
    //   userId,
    // );
    // return this.prismaService.userOnDevice.upsert({
    //   create: {
    //     userId,
    //     deviceId,
    //   },
    //   update: {
    //     updatedAt: new Date().toISOString(),
    //   },
    //   where: {
    //     userId_deviceId: {
    //       userId,
    //       deviceId,
    //     },
    //   },
    // });
    return null;
  }

  insertUserOnDevice(deviceId: string, userId: string) {
    // this.logger.info(
    //   '[insertUserOnDevice] deviceId >>',
    //   deviceId,
    //   'userId>>>',
    //   userId,
    // );
    // return this.prismaService.userOnDevice.create({
    //   data: {
    //     userId,
    //     deviceId,
    //   },
    // });
    return null;
  }

  async saveDevice(device: DeviceDTO) {
    this.logger.info('[saveDevice] device = %s', device);
    const deviceSecret = await encryptedWithPbkdf2(device.deviceId);
    const clientResult = await this.prismaService.oAuthTerminal.create({
      data: {
        name: device.name,
        os: device.os,
        type: device.type,
        engine: device.engine,
        isOnline: DeviceLineStatus.ONLINE,
        isLocked: DeviceLock.UN_LOCKED,
      },
      select: {
        id: true,
      },
    });
    return clientResult;
  }

  async saveGrant(...grants: string[]) {
    return null;
  }

  async findGrantsByName(...names: string[]) {
    return null;
  }

  async saveGrantOnDevice(deviceId: string, ...grantIds: { id: string }[]) {
    // await this.prismaService.grantOnDevice.createMany({
    //   data: grantIds.map((grantId) => {
    //     return {
    //       grantId: grantId.id,
    //       deviceId,
    //     };
    //   }),
    //   skipDuplicates: true,
    // });
    // this.logger.info('[saveGrantOnDevice] save grant on device successfully!!');
    return null;
  }

  async updateDevice(device: DeviceDTO) {
    this.logger.info('[updateDevice] updateDevice device successfully!!');
    return null;
  }

  async getDeviceById(id: string) {
    this.logger.info('[getDeviceById] id = %s', id);

    this.logger.info('[getDeviceById] getDeviceById successfully!!');
    return null;
  }

  async pageList(
    query: DeviceParams,
  ): Promise<Pagination<Partial<OAuthClientDetails>[]>> {
    const where = {
      ...excludePagination(query),
      ...likeQuery<OAuthClientDetails>(query, 'id'),
    };
    const queryPage = generateQueryParam(query);
    return {
      total: 0,
      data: [],
      pageSize: query.pageSize,
      pageNumber: query.current,
    };
  }

  async batchDeleteDevice(deviceIdObj: { ids: string[] }) {
    this.logger.info('[batchDeleteDevice] batchDeleteDevice successfully!!');
    return {};
  }

  async getDeviceDetail(id: string) {
    this.logger.info('[getDeviceDetail] id = %s', id);
    this.logger.info('[getDeviceDetail] get client detail  successfully!!');
    return null;
  }
}
