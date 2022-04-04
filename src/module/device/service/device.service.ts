import { LoggerService, Logger, PageInfoNumber, QueryParams } from '@/common';
import { Injectable } from '@nestjs/common';
import { DeviceDao } from '../dao/device.dao';
import { DeviceDTO } from '../types/device';
@Injectable()
export class DeviceService {
  private logger: Logger;
  constructor(
    private readonly loggerService: LoggerService,
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

  async updateDevice(device: DeviceDTO) {
    return this.deviceDao.updateDevice(device);
  }

  async getList({
    pageSize,
    current,
    id,
  }: QueryParams): Promise<
    DeviceDTO | DeviceDTO[] | PageInfoNumber<DeviceDTO[]>
  > {
    if (id) {
      this.logger.info('[get]::: findUnique ');
      const foundDevice = await this.deviceDao.getDeviceById(id);
      return {
        ...foundDevice,
        grants: foundDevice.grants.map(({ grant }) => grant.name),
      };
    }

    this.logger.info('[get]::: enter');
    return this.deviceDao.getDeviceListForPage(pageSize, current);
  }

  async delete(ids: { ids: string[] }) {
    this.logger.info('[delete]::: ids :::', ids.ids);
    await this.deviceDao.batchDeleteDevice(ids);
    return {};
  }
}
