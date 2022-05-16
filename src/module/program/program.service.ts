import { Logger, LoggerService, Pagination, PrismaService } from '@/common';
import { generatePaginationParams } from '@/util';
import { Injectable } from '@nestjs/common';
import { Program } from '@prisma/client';
import { ProgramDTO } from './program.dto';

@Injectable()
export class ProgramService {
  private Log: Logger;
  constructor(private log: LoggerService, private readonly db: PrismaService) {
    this.Log = this.log.getLogger(ProgramService.name);
  }

  async getPlaybills(query: ProgramDTO): Promise<Pagination<Program[]>> {
    this.Log.info('getPlaybills query = %s', query);
    const [total, playbills] = await this.db.$transaction([
      this.db.program.count(),
      this.db.program.findMany(generatePaginationParams(query)),
    ]);
    return {
      total,
      data: playbills,
      pageNumber: query.current,
      pageSize: query.pageSize,
    };
  }
}
