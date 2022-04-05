import { Logger, LoggerService } from '@/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EPGService {
  private log: Logger;
  constructor(
    private readonly logger: LoggerService,
    private httpService: HttpService,
  ) {
    this.log = this.logger.getLogger(EPGService.name);
  }

  async downEpgXMLFrom3rd() {
    const downloadEpgUrl = process.env.epg_xml_download_url as string;
    const downloadSources = await this.httpService.get(downloadEpgUrl);
  }
}
