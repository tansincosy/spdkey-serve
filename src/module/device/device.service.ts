import { Pagination } from '@/interface/page-info.interface';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import { Injectable } from '@nestjs/common';
import { DeviceDao } from './device.dao';
import { DeviceDTO, DeviceParams } from './device.dto';
import { OAuthClientDetails } from '@dva_oauth/prisma/client';

@Injectable()
export class DeviceService {
  private logger: Logger;
  constructor(
    private readonly loggerService: LoggerService,
    private readonly deviceDao: DeviceDao,
  ) {
    this.logger = this.loggerService.getLogger(DeviceService.name);
  }

  pageList(
    query: DeviceParams,
  ): Promise<Pagination<Partial<OAuthClientDetails>[]>> {
    this.logger.info('[get]::: enter');
    return this.deviceDao.pageList(query);
  }

  async getDeviceDetail(id: string) {
    return this.deviceDao.getDeviceDetail(id);
  }

  async saveDevice(device: DeviceDTO) {
    this.logger.info('[saveDevice] enter');

    const { id } = await this.deviceDao.saveDevice({
      name: device.name,
      deviceId: device.deviceId,
      os: device.os,
      type: device.type,
      engine: device.engine,
    });

    await this.deviceDao.saveGrant('password', 'refresh_token');

    const grantIds = await this.deviceDao.findGrantsByName(
      'password',
      'refresh_token',
    );

    await this.deviceDao.saveGrantOnDevice(id, ...grantIds);

    return { id };
  }

  async updateDevice(device: DeviceDTO) {
    return this.deviceDao.updateDevice(device);
  }

  async delete(ids: { ids: string[] }) {
    this.logger.info('[delete]::: ids :::', ids.ids);
    await this.deviceDao.batchDeleteDevice(ids);
    return {};
  }
}
