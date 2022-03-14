import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log:
        process.env.LOG_LEVEL === 'debug'
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
