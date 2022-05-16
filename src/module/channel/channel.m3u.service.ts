import {
  BaseException,
  DownloadService,
  Logger,
  LoggerService,
  PrismaService,
} from '@/common';
import { CommonConfig } from '@/config';
import {
  BasicExceptionCode,
  ChannelConstant,
  ChannelReg,
  CONFIG_KEY,
} from '@/constant';
import { getContentByRegex, moreThOne } from '@/util';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  existsSync,
  ensureDirSync,
  emptyDir,
  readFile,
  readFileSync,
} from 'fs-extra';
import { join } from 'path';
import { promisify } from 'util';
import { EpgChannel, EpgUrl, M3U, M3uChannel } from './channel.type';
import { exec } from 'child_process';

const readFilePromise = promisify(readFile);
const execPromise = promisify(exec);

@Injectable()
export class M3UService {
  private logger: Logger;
  private appConfig: CommonConfig;

  private downloadEPGXMLPercent = 0;
  constructor(
    private readonly loggerService: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly downloaderService: DownloadService,
  ) {
    this.logger = this.loggerService.getLogger(M3UService.name);
    this.appConfig = this.configService.get<CommonConfig>(
      CONFIG_KEY.APP_CONFIG,
    );
  }

  /**
   * 根据地址查询文件名
   * @param m3uUrl
   * @returns
   */
  async findM3uByUrl(m3uUrl: string): Promise<M3U> {
    this.logger.info('findFileNameByUrl m3uUrl = %s ', m3uUrl);
    const m3uInfo = await this.prismaService.m3U.findFirst({
      where: {
        url: m3uUrl,
      },
      select: {
        name: true,
        id: true,
      },
    });
    this.logger.debug('result m3uInfo = %s', m3uInfo);
    return m3uInfo || {};
  }

  async deleteM3uRecord(m3uUrl: string): Promise<void> {
    this.logger.info('deleteM3u m3uUrl = %s ', m3uUrl);
    (await this.prismaService.m3U.delete({
      where: {
        url: m3uUrl,
      },
      select: {
        id: true,
      },
    })) || {};
  }

  /**
   * 通过名字查询目录中是否存在文件
   */

  async isExistM3uByName(name: string): Promise<boolean> {
    this.logger.info('findM3uByName name = %s ', name);
    const fullPathName = join(this.appConfig.m3uPath, name);
    const result = existsSync(fullPathName);
    this.logger.info('isExistM3uByName result = %s ', result);
    return result;
  }

  async downloadM3U(m3uUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.downloaderService
        .downloadFile(m3uUrl, this.appConfig.m3uPath, 'YYYYMMDDHHmmss')
        .on('end', (dlFile) => {
          resolve(dlFile.fileName);
        })
        .on('error', (err) => {
          reject(err);
        })
        .start();
    });
  }

  async saveM3UInfoData(fileName: string, m3uUrl: string) {
    this.logger.debug('saveM3UInfoData fileName = %s ', fileName);
    const result = await this.prismaService.m3U.create({
      data: {
        url: m3uUrl,
        name: fileName,
      },
      select: {
        id: true,
      },
    });
    this.logger.info('saveM3UInfoData successful fileName = %s ', fileName);
    return result;
  }

  async parseM3u(fileName: string): Promise<{
    m3uSourceData: string[];
    epgXmlData: string;
  }> {
    let m3uFileContent = '';
    m3uFileContent = await readFilePromise(
      join(this.appConfig.m3uPath, fileName),
      {
        encoding: 'utf-8',
      },
    ).catch((error) => {
      m3uFileContent = '';
      this.logger.error('parseM3u error = %s', error);
      throw new BaseException(BasicExceptionCode.PARSER_FILE_FAILED);
    });

    if (!m3uFileContent) {
      return {
        m3uSourceData: [],
        epgXmlData: '',
      };
    }

    const m3uSourceData = m3uFileContent
      .split(ChannelConstant.M3U_INFO_FLAG)
      .filter((item) => !item.startsWith(ChannelConstant.M3U_FLAG));

    const epgXmlData = getContentByRegex(m3uFileContent, ChannelReg.TVG_URL, 1);

    return {
      m3uSourceData,
      epgXmlData,
    };
  }

  m3uChannelToJson(channels: string[]) {
    return channels
      .map((channelItemStr: string) => {
        const channelId = getContentByRegex(
          channelItemStr,
          ChannelReg.TVG_ID,
          1,
        );

        const logo = getContentByRegex(channelItemStr, ChannelReg.TVG_LOGO, 1);
        const name = getContentByRegex(
          channelItemStr,
          ChannelReg.TVG_CHANNEL_NAME,
          1,
        );
        const language = getContentByRegex(
          channelItemStr,
          ChannelReg.TVG_LANGUAGE,
          1,
        );
        const country = getContentByRegex(
          channelItemStr,
          ChannelReg.TVG_COUNTRY,
          1,
        );

        const playUrl = getContentByRegex(
          channelItemStr,
          ChannelReg.TVG_PLAY_URL,
          0,
        );

        return {
          channelId,
          logo,
          name,
          language,
          country,
          playUrl,
        };
      })
      .filter((chan) => chan.name);
  }

  async batchAddChannelSource(channels: M3uChannel[]) {
    this.logger.info('begin batchAddChannels to db');
    await this.prismaService.channelSource.createMany({
      data: channels.map((item) => {
        return {
          name: item.name,
          channelId: item.channelId,
          logo: item.logo,
          playUrl: item.playUrl,
          country: item.country,
          language: item.language,
          m3UId: item.m3UId,
        };
      }),
      skipDuplicates: true,
    });
    this.logger.info('batchAddChannels successful');
  }

  getAllM3U() {
    this.logger.info('getAllM3U start');
    return this.prismaService.channelSource.findMany({
      select: {
        id: true,
        logo: true,
      },
    });
  }

  async downloadChannelLogo(channelSource: M3uChannel[]) {
    if (channelSource.length > 0) {
      const readyDownloadSize = channelSource.length;
      const downloadPromises = channelSource.map((item, index) => {
        return new Promise<{
          name: string;
          id: string;
        }>((resolve) => {
          if (item.logo) {
            this.downloaderService
              .downloadFile(item.logo, this.appConfig.logoPath)
              .on('end', (dlFile) => {
                this.logger.debug(
                  'downloadChannelLogo item = %s, index = %s',
                  item,
                  index,
                );
                this.logger.info(
                  'downloadChannelLogo percent = %s',
                  (((index + 1) / readyDownloadSize) * 100).toFixed(2),
                );
                resolve({
                  name: dlFile.fileName,
                  id: item.id,
                });
              })
              .start()
              .catch((error) => {
                this.logger.error('downloadChannelLogo error = %s', error);
                resolve({
                  name: '',
                  id: item.id,
                });
              });
          } else {
            resolve({
              name: '',
              id: item.id,
            });
          }
        });
      });

      const allDownloadFiles = [];

      for await (const downloadObj of downloadPromises) {
        allDownloadFiles.push(downloadObj);
      }

      const resultPromise = allDownloadFiles.map((item) => {
        return this.prismaService.channelSource.update({
          where: {
            id: item.id,
          },
          data: {
            logo: item.name,
          },
        });
      });
      return Promise.all(resultPromise);
    }
  }

  getDownloadedPercent() {
    return this.downloadEPGXMLPercent;
  }

  async downloadEPGXML(epgXMlUrls: string[]) {
    ensureDirSync(this.appConfig.programXMLPath);
    emptyDir(this.appConfig.programXMLPath);
    const readyDownloadSize = epgXMlUrls.length;
    this.downloadEPGXMLPercent = 0;
    const downloadPromises = epgXMlUrls.map((url, index) => {
      return new Promise<EpgUrl>((resolve) => {
        this.downloaderService
          .downloadFile(url, this.appConfig.programXMLPath)
          .on('end', (dlFile) => {
            this.logger.debug(
              'downloadEPGXML url = %s, index = %s',
              url,
              index,
            );
            this.downloadEPGXMLPercent = (index + 1) / readyDownloadSize;
            this.logger.info(
              'downloadEPGXML percent = %s',
              this.downloadEPGXMLPercent.toFixed(2),
            );
            resolve({
              name: dlFile.fileName,
              url,
            });
          })
          .start()
          .catch((error) => {
            this.logger.error('downloadEPGXML error = $s', error);
            resolve({
              name: '',
              url,
            });
          });
      });
    });
    const epgs: EpgUrl[] = [];
    for await (const iterator of downloadPromises) {
      epgs.push(iterator);
    }
    return epgs;
  }

  batchAddEpgXMUrl(epgUrls: EpgUrl[]) {
    return this.prismaService.ePGUrl.createMany({
      data: epgUrls.map(({ name, url }) => {
        return {
          url,
          name,
        };
      }),
      skipDuplicates: true,
    });
  }

  async parseJSONForProgram(downloadFiles: EpgUrl[]) {
    if (moreThOne(downloadFiles)) {
      const { stdout } = await execPromise(
        `sh scripts/merge_xml.sh ${this.appConfig.allowChannelPath}`,
      );

      this.logger.info('merge xml success!! stdout=', stdout);

      const fileContent = readFileSync(
        `${this.appConfig.allowChannelPath}/${stdout.trim()}`,
        'utf-8',
      );
      const allowEPGs = await this.prismaService.ePGUrl.findMany({});
      if (fileContent) {
        const channelEpgs = fileContent.split('</channel').map((item) => {
          const [, fileName] = item.match(/tmp\/program\/(.*):<channel/) || [];
          const [, channelId, name, logo, url] =
            item.match(ChannelReg.XML_GROUP) || [];
          const allowEPG = allowEPGs.find((epg) => epg.name === fileName);
          return {
            epgUrlId: allowEPG?.id,
            channelId,
            name,
            logo,
            url,
          };
        }) as EpgChannel[];

        return channelEpgs;
      }
      return [];
    }
    return [];
  }

  async batchAddEpgXmlChannels(epgChannels: EpgChannel[]) {
    await this.prismaService.ePGSourceChannel.deleteMany({});
    return this.prismaService.ePGSourceChannel.createMany({
      data: epgChannels.map((item) => {
        return {
          name: item.name,
          channelId: item.channelId || '',
          logo: item.logo,
          ePGUrlId: item.epgUrlId,
        };
      }),
      skipDuplicates: true,
    });
  }
}
