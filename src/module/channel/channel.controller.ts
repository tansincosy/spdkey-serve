import { Body, Controller, Post } from '@nestjs/common';
import { ParseUrlDTO } from './channel.dto';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('/source')
  parseM3uUrl(@Body() parseUrlDTO: ParseUrlDTO) {
    return this.channelService.parseM3uUrl(parseUrlDTO);
  }
}
