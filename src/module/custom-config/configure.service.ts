import { Logger } from 'log4js';
import { Injectable } from '@nestjs/common';
import {
  LoggerService,
  PrismaService,
  PageInfoNumber,
  QueryParams,
} from '@/common';
import { ConfigureDao } from './configure.dao';
import { Config } from './configure.dto';

@Injectable()
export class ConfigureService {
  private logger: Logger;
  constructor(
    private log: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly configDao: ConfigureDao,
  ) {
    this.logger = this.log.getLogger(ConfigureService.name);
  }

  getConfigType() {
    return this.configDao.getAllConfigType();
  }

  async checkNameRepeat(name: string) {
    return this.configDao.checkDuplicatedByName(name);
  }

  async get({
    pageSize,
    current,
  }: QueryParams): Promise<Config | Config[] | PageInfoNumber<Config[]>> {
    return this.configDao.getConfigByPage(pageSize, current);
  }

  async update(t: Config): Promise<{ id: string }> {
    return this.configDao.updateConfig(t);
  }
  async add(t: Config): Promise<{ id: string }> {
    return this.configDao.addConfig(t);
  }
  async delete(t: { ids: string[] }): Promise<Record<string, any>> {
    this.configDao.batchDeleteConfig(t);
    return {};
  }
}
