import { DeleteIdPrams, QueryParams } from '@/common';
import { Injectable } from '@nestjs/common';
import { LoggerDao } from '../dao/logger.dao';

@Injectable()
export class LoggerService {
  constructor(private readonly loggerDao: LoggerDao) {}

  addLog(logData: any) {
    return this.loggerDao.addLog(logData);
  }

  getLogList(query: QueryParams) {
    return null;
  }
  deleteLogger(delParams: DeleteIdPrams) {
    return null;
  }
}
