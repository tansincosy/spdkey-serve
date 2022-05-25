import { AuthGuard } from '@/guard/auth.guard';
import { BatchDelDTO } from '@/model/delete.model';
import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OperationLogService } from './operation-log.service';
import { QueryLogPrams } from './operation-log.type';

@Controller('operation-log')
export class OperationLogController {
  constructor(private readonly operationLogService: OperationLogService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() query: QueryLogPrams) {
    return this.operationLogService.getLogList(query);
  }

  @Delete()
  @UseGuards(AuthGuard)
  delLog(@Body() delParams: BatchDelDTO) {
    return this.operationLogService.deleteLogger(delParams);
  }
}
