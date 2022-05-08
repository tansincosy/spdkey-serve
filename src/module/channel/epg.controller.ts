import { Controller, Get, Query } from '@nestjs/common';
import { QueryChannelSourceDTO } from './channel.dto';
import { ChannelService } from './channel.service';

@Controller('epg-xml')
export class EPGController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('program-channel')
  getProgramChannel(@Query() query: QueryChannelSourceDTO) {
    return this.channelService.getProgramChannel(query);
  }
}
