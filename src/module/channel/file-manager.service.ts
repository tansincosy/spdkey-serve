import { BasicExceptionCode } from '@/constant';
import { Logger, LoggerService, BaseException } from '@/common';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { readFile, existsSync, createWriteStream } from 'fs';
import { promisify } from 'util';

const readFilePromise = promisify(readFile);
@Injectable()
export class FileManagerService {
  private logger: Logger;
  constructor(private readonly loggerService: LoggerService) {
    this.logger = this.loggerService.getLogger(FileManagerService.name);
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
