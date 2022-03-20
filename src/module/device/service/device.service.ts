import { Log4JService } from '@/common';
import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { DeviceDao } from '../dao/device.dao';
import { DeviceDTO } from '../types/device';
@Injectable()
export class DeviceService {
  private logger: Logger;
  constructor(
    private readonly loggerService: Log4JService,
    private readonly deviceDao: DeviceDao,
  ) {
    this.logger = this.loggerService.getLogger(DeviceService.name);
  }

  async saveDevice(device: DeviceDTO) {
    this.logger.info('[saveDevice] enter');

    const { deviceSecret, id } = await this.deviceDao.saveDevice({
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

    return { deviceSecret };
  }
}
