import { PrismaService } from '@/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerDao {
  constructor(private readonly prismaService: PrismaService) {}

  addLog(logData: any) {
    console.log('logData', logData);
    return {};
  }
}
