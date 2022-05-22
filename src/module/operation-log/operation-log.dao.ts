import {
  Logger,
  LoggerService,
  Pagination,
  PrismaService,
  QueryPagination,
} from '@/common';
import { excludePagination, generateQueryParam, likeQuery } from '@/util';
import { Injectable } from '@nestjs/common';
import { OperationLog } from '@prisma/client';
import { OperationLogDTO, QueryLogPrams } from './operation-log.type';

@Injectable()
export class OperationLogDAO
  implements QueryPagination<QueryLogPrams, OperationLog>
{
  private log: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
  ) {
    this.log = this.loggerService.getLogger(OperationLogDAO.name);
  }

  async pageList(
    query: QueryLogPrams,
  ): Promise<Pagination<Partial<OperationLog>[]>> {
    const queryParam = generateQueryParam(query);
    const where = {
      ...excludePagination(query),
    };
    const configList = this.prismaService.operationLog.findMany({
      ...queryParam,
      where,
    });

    const configCount = this.prismaService.operationLog.count({
      ...queryParam,
      where,
    });
    const [total, logList] = await this.prismaService.$transaction([
      configCount,
      configList,
    ]);

    return {
      total,
      data: logList,
      pageNumber: query.current,
      pageSize: query.pageSize,
    };
  }

  async addLog(logData: OperationLogDTO[]) {
    this.log.debug('addLog logData', logData);
    await this.prismaService.operationLog.createMany({
      data: logData.map((item) => {
        return {
          context: item.context,
          message: item.message,
          level: item.level,
          user: item.user,
        };
      }),
    });
    this.log.info('save operation success');
    return {};
  }

  async delLog(ids: string[]) {
    await this.prismaService.operationLog.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    this.log.info('delete log success!!');
    return {};
  }
}
