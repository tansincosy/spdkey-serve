import { AuthGuard } from '@/guard/auth.guard';
import { BatchDelDTO } from '@/model/delete.model';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigDTO, ConfigQueryDTO } from './configure.dto';
import { ConfigureService } from './configure.service';

@Controller('config')
export class ConfigureController {
  constructor(private readonly configService: ConfigureService) {}

  @Get()
  getConfig(@Query() query: ConfigQueryDTO) {
    return this.configService.pageList(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  addConfig(@Body() config: ConfigDTO) {
    return this.configService.add(config);
  }

  @Put()
  @UseGuards(AuthGuard)
  updateConfig(@Body() config: ConfigDTO) {
    return this.configService.update(config);
  }

  @Delete()
  @UseGuards(AuthGuard)
  delConfig(@Body() config: BatchDelDTO) {
    return this.configService.delete(config);
  }

  @Get('duplicated-name')
  @UseGuards(AuthGuard)
  checkNameRepeat(@Query() { name }: { name: string }) {
    return this.configService.checkNameRepeat(name);
  }

  @Get('type')
  @UseGuards(AuthGuard)
  getConfigType() {
    return this.configService.getConfigType();
  }
}
