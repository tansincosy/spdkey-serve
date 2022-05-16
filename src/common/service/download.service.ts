import { Injectable } from '@nestjs/common';
import { Logger } from '@/common';
import { LoggerService } from './log4j.service';
import { DownloaderHelper } from 'node-downloader-helper';
import * as dayjs from 'dayjs';
import { byteHelper } from '@/util';
import { ensureDirSync } from 'fs-extra';

@Injectable()
export class DownloadService {
  private log: Logger;
  constructor(private readonly logService: LoggerService) {
    this.log = this.logService.getLogger('download');
  }

  downloadFile(
    url: string,
    filePath: string,
    dateFile?: string,
    isSkip = false,
  ): DownloaderHelper {
    let startTime = new Date().getTime();
    ensureDirSync(filePath);
    return new DownloaderHelper(url, filePath, {
      fileName: (filename) => {
        return dateFile ? dayjs().format(dateFile) + `.${filename}` : filename;
      },
      retry: { maxRetries: 1, delay: 3000 },
      override: { skip: isSkip },
    })
      .on('end', (d) => this.log.info('Download Completed', d))
      .on('error', (err) => this.log.warn('Download Failed', err))
      .on('retry', (attempt, opts, err) => {
        this.log.warn({
          RetryAttempt: `${attempt}/${opts.maxRetries}`,
          StartsOn: `${opts.delay / 1000} secs`,
          Reason: err ? err.message : 'unknown',
        });
      })
      .on('stateChanged', (state) => this.log.info('State: ', state))
      .on('progress', (stats) => {
        const progress = stats.progress.toFixed(1);
        const speed = byteHelper(stats.speed);
        const downloaded = byteHelper(stats.downloaded);
        const total = byteHelper(stats.total);
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        if (elapsedTime > 1000) {
          startTime = currentTime;
          this.log.info(`${speed}/s - ${progress}% [${downloaded}/${total}]`);
        }
      });
  }
}
