import { DeleteIdPrams, QueryParams } from '@/common';
import { Injectable } from '@nestjs/common';
import { OperationLogDAO } from './operation-log.dao';
import { OperationLogDTO } from './operation-log.type';

@Injectable()
export class OperationLogService {
  constructor(private readonly operationLogDAO: OperationLogDAO) {}

  getLogList(query: QueryParams) {
    return this.operationLogDAO.pageList(query);
  }
  deleteLogger({ ids }: DeleteIdPrams) {
    return this.operationLogDAO.delLog(ids);
  }

  async logs(logData: OperationLogDTO[]) {
    await this.operationLogDAO.addLog(logData);
  }

  info(user: string, context: string, message: string) {
    return this.operationLogDAO.addLog([
      {
        level: 'INFO',
        message,
        user,
        context,
      },
    ]);
  }

  error(user: string, context: string, message: string) {
    return this.operationLogDAO.addLog([
      {
        level: 'ERROR',
        message,
        context,
        user,
      },
    ]);
  }

  warn(user: string, context: string, message: string) {
    return this.operationLogDAO.addLog([
      {
        level: 'WARN',
        message,
        user,
        context,
      },
    ]);
  }
}
