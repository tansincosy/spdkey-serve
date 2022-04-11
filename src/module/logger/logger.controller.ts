import { DeleteIdPrams, QueryParams } from '@/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { LoggerService } from './logger.service';

@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Post()
  async addLog(@Body() data: any) {
    return this.loggerService.addLog(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Query() query: QueryParams) {
    return this.loggerService.getLogList(query);
  }

  @Delete()
  @UseGuards(AuthGuard)
  delLog(@Body() delParams: DeleteIdPrams) {
    return this.loggerService.deleteLogger(delParams);
  }
}
