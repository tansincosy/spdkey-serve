import { Logger, LoggerService } from '@/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { lastValueFrom, map } from 'rxjs';
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
    this.log.info('[downEpgXMLFrom3rd] downloadEpgUrl>>>', downloadEpgUrl);
    const downloadObservable = this.httpService
      .request({
        method: 'GET',
        url: downloadEpgUrl,
        responseType: 'stream',
      })
      .pipe(map((resp) => resp.data));
    const downloadData = await lastValueFrom(downloadObservable);
    downloadData.pipe(fs.createWriteStream('./epg.xml'));
    this.log.info('[downEpgXMLFrom3rd] download successfully >>>');
  }
}
