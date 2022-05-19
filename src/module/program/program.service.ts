import { excludePagination, generateQueryParam, likeQuery } from '@/util';
import {
  Logger,
  LoggerService,
  Pagination,
  PrismaService,
  QueryPagination,
} from '@/common';
import { Injectable } from '@nestjs/common';
import { Program } from '@prisma/client';
import { ProgramDTO } from './program.dto';

@Injectable()
export class ProgramService implements QueryPagination<ProgramDTO, Program> {
  private Log: Logger;
  constructor(private log: LoggerService, private readonly db: PrismaService) {
    this.Log = this.log.getLogger(ProgramService.name);
  }

  async pageList(query: ProgramDTO): Promise<Pagination<Partial<Program>[]>> {
    this.Log.info('getPlaybills query = %s', query);
    const queryParam = generateQueryParam(query);
    const where = {
      ...excludePagination(query),
      ...likeQuery<Program>(query, 'name'),
    };
    const [total, playbills] = await this.db.$transaction([
      this.db.program.count({
        ...queryParam,
        where,
      }),
      this.db.program.findMany({
        ...queryParam,
        where,
      }),
    ]);
    return {
      total,
      data: playbills,
      pageNumber: query.current,
      pageSize: query.pageSize,
    };
  }
}
