import { BatchDelDTO } from '@/model/delete.model';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import {
  ChannelQueryDTO,
  ParseUrlDTO,
  QueryChannelSourceDTO,
} from './channel.dto';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('/source')
  parseM3uUrl(@Body() parseUrlDTO: ParseUrlDTO) {
    return this.channelService.contrSourceChannelData(
      parseUrlDTO.url,
      parseUrlDTO.isForceUpdate,
    );
  }

  @Get('/source')
  getM3uUrl(@Query() query: QueryChannelSourceDTO) {
    return this.channelService.getM3uUrl(query);
  }

  @Delete('/source')
  deleteM3uUrl(@Body() idObj: BatchDelDTO) {
    return this.channelService.batchDelete(idObj);
  }

  @Get('/source/percent')
  getPercent() {
    return this.channelService.getDownloadedPercent();
  }

  @Get()
  getChannel(@Query() query: ChannelQueryDTO) {
    return this.channelService.getChannels(query);
  }
}
