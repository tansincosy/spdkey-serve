import { Logger } from 'log4js';
import { Injectable } from '@nestjs/common';
import { ConfigureDao } from './configure.dao';
import { ConfigDTO, ConfigQueryDTO } from './configure.dto';
import { Config, ConfigType } from '@prisma/client';
import { OperationLogService } from '../operation-log/operation-log.service';
import { Pagination, QueryPagination } from '@/interface/page-info.interface';
import { LoggerService } from '@/processor/log4j/log4j.service';
import { BatchDelDTO } from '@/model/delete.model';

@Injectable()
export class ConfigureService
  implements QueryPagination<ConfigQueryDTO, Config & ConfigType>
{
  private logger: Logger;
  constructor(
    private log: LoggerService,
    private actionLog: OperationLogService,
    private readonly configDao: ConfigureDao,
  ) {
    this.logger = this.log.getLogger(ConfigureService.name);
  }
  pageList(
    query: ConfigQueryDTO,
  ): Promise<Pagination<Partial<Config & ConfigType>[]>> {
    return this.configDao.pageList(query);
  }

  getConfigType() {
    return this.configDao.getAllConfigType();
  }

  async checkNameRepeat(name: string) {
    return this.configDao.checkDuplicatedByName(name);
  }

  async update(t: ConfigDTO): Promise<{ id: string }> {
    const result = await this.configDao.updateConfig(t);
    this.actionLog.info(
      'user',
      ConfigureService.name,
      'update custom config success',
    );
    return result;
  }
  async add(t: ConfigDTO): Promise<{ id: string }> {
    return this.configDao.addConfig(t);
  }
  async delete(t: BatchDelDTO): Promise<Record<string, any>> {
    this.configDao.batchDeleteConfig(t);
    return {};
  }
}
