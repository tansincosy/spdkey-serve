import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EPGService } from './epg.service';

@Module({
  imports: [HttpModule],
  providers: [EPGService],
})
export class EPGModule {}
