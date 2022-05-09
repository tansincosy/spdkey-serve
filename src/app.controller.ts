import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DownloadService } from './common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly downloadService: DownloadService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('download')
  async downloadFile() {
    console.time();
    await this.downloadService
      .downloadFile(
        'https://iptv-org.github.io/iptv/index.m3u',
        'tmp',
        'YYYYMMDD',
      )
      .on('end', (d) => console.log('Download Completed1111', d))
      .start();

    console.timeEnd();
    console.log('edn');
    return {};
  }
}
