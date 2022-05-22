import { OperationLogController } from './operation-log.controller';
import { Global, Module } from '@nestjs/common';
import { OperationLogService } from './operation-log.service';
import { OperationLogDAO } from './operation-log.dao';

@Module({
  controllers: [OperationLogController],
  providers: [OperationLogService, OperationLogDAO],
  exports: [OperationLogService],
})
@Global()
export class OperationLogModule {}
