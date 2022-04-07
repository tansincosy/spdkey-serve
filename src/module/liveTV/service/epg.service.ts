import { Logger, LoggerService } from '@/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { lastValueFrom, map } from 'rxjs';
import { XMLParser } from 'fast-xml-parser';
import { randomUUID } from 'crypto';
@Injectable()
export class EPGService {
  private log: Logger;
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
  ) {
    this.log = this.logger.getLogger(EPGService.name);
  }

  async downloadEpgXMLFrom3rd(epgUrl: string) {
    this.log.info('[downEpgXMLFrom3rd] epgUrl>>>', epgUrl);
    const downloadObservable = this.httpService
      .request({
        method: 'GET',
        url: epgUrl,
        responseType: 'stream',
      })
      .pipe(map((resp) => resp.data));
    const downloadData = await lastValueFrom(downloadObservable);
    const fileName = `./epg_${randomUUID}.xml`;
    this.log.info(' [downEpgXMLFrom3rd] fileName>>>', fileName);
    downloadData.pipe(fs.createWriteStream(fileName));
    this.log.info('[downEpgXMLFrom3rd] download successfully >>>');
  }

  async convertXmlToJson() {
    try {
      const xml = fs.readFileSync('./epg.xml', 'utf8');
      const xmlParser = new XMLParser();
      const jsonObj = xmlParser.parse(xml.toString());
      return jsonObj;
    } catch (error) {
      this.log.error('[convertXmlToJson] error>>>', error);
      return {};
    }
  }
}
