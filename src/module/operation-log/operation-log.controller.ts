import { DeleteIdPrams } from '@/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
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
  delLog(@Body() delParams: DeleteIdPrams) {
    return this.operationLogService.deleteLogger(delParams);
  }
}
