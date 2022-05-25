import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Logger, LoggerService } from '../log4j/log4j.service';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  private log: Logger;
  private logList: any;
  private logListFlag: boolean;
  constructor(private readonly logger: LoggerService) {
    super({
      log: [{ emit: 'event', level: 'query' }],
      errorFormat: 'colorless',
    });
    this.log = this.logger.getLogger(PrismaService.name);

    this.$use(async (params, next) => {
      const { action, args } = params;
      if (action === 'update') {
        const { data } = args || {};
        data.updatedAt = new Date().toISOString();
      }
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      this.log.info(
        `[prisma:query] ${params.model}.${params.action} took ${
          after - before
        }ms`,
      );
      return result;
    });
    this.$on('query', (e) => {
      const { query } = e;
      this.makeBatchLogger(query);
    });
  }

  makeBatchLogger(query: string) {
    if (query === 'BEGIN') {
      this.logList = [];
      this.logListFlag = true;
    }
    if (!this.logListFlag) {
      this.log.debug('[prisma:query]  ', query);
    } else {
      this.logList.push(query);
    }
    if (query === 'COMMIT') {
      this.logListFlag = false;
      this.log.debug('[prisma:query]', this.logList);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      this.log.info('beforeExit');
      await app.close();
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
