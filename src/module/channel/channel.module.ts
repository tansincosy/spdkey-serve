import { EPGController } from './epg.controller';
import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelDAO } from './channel.dao';
import { ChannelService } from './channel.service';
import { FileManagerService } from './file-manager.service';

@Module({
  controllers: [ChannelController, EPGController],
  providers: [ChannelService, ChannelDAO, FileManagerService],
})
export class ChannelModule {}
