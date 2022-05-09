import { DeleteIdPrams, QueryParams } from '@/common';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import {
  ParseUrlDTO,
  QueryChannelDTO,
  QueryChannelSourceDTO,
} from './channel.dto';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('/source')
  parseM3uUrl(@Body() parseUrlDTO: ParseUrlDTO) {
    return this.channelService.parseM3uUrl(parseUrlDTO);
  }

  @Get('/source')
  getM3uUrl(@Query() query: QueryChannelSourceDTO) {
    return this.channelService.getM3uUrl(query);
  }

  @Delete('/source')
  deleteM3uUrl(@Body() idObj: DeleteIdPrams) {
    return this.channelService.batchDelete(idObj);
  }

  @Get()
  getChannels(@Query() channelParams: QueryChannelDTO) {
    return this.channelService.getChannels(channelParams);
  }
}
