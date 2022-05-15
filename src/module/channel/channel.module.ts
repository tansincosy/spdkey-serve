import { EPGController } from './epg.controller';
import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelDAO } from './channel.dao';
import { ChannelService } from './channel.service';
import { M3UService } from './channel.m3u.service';

@Module({
  controllers: [ChannelController, EPGController],
  providers: [ChannelService, ChannelDAO, M3UService],
})
export class ChannelModule {}
