import { BasicExceptionCode } from '@/constant';
import { Logger, LoggerService, BaseException } from '@/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { readFile, existsSync, createWriteStream } from 'fs';
import { promisify } from 'util';

const readFilePromise = promisify(readFile);
@Injectable()
export class FileManagerService {
  private logger: Logger;
  constructor(
    private readonly loggerService: LoggerService,
    private readonly httpService: HttpService,
  ) {
    this.logger = this.loggerService.getLogger(FileManagerService.name);
  }

  async downloadFileFrom3rd(epgUrl: string, targetFile: string) {
    this.logger.info(
      '[downloadFileFrom3rd] epgUrl = %s, targetFile =%s',
      epgUrl,
      targetFile,
    );
    try {
      const downloadObservable = this.httpService
        .request({
          method: 'GET',
          url: epgUrl,
          responseType: 'stream',
        })
        .pipe(map((resp) => resp.data));
      const downloadData = await lastValueFrom(downloadObservable);
      downloadData.pipe(createWriteStream(targetFile));
    } catch (error) {
      this.logger.error('download file error!');
      throw new BaseException(BasicExceptionCode.DOWNLOAD_FILE_FAILED);
    }

    this.logger.info('[downEpgXMLFrom3rd] download successfully >>>');
  }

  async readFile(filePath: string): Promise<string> {
    if (!existsSync(filePath)) {
      return '';
    }

    return readFilePromise(filePath, {
      encoding: 'utf8',
    });
  }
}
