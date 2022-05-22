import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Logger } from 'log4js';
import { LoggerService } from './log4j.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private log: Logger;
  constructor(private readonly logger: LoggerService) {
    super({
      log:
        process.env.log_level === 'debug'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
    this.$use(async (params, next) => {
      const { action, args } = params;
      if (action === 'update') {
        const { data } = args || {};
        data.updatedAt = new Date().toISOString();
      }
      const result = await next(params);
      return result;
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
