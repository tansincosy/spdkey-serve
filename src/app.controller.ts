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
  getHello() {
    return this.appService.getHello();
  }
}
