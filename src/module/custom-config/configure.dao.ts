import { Injectable } from '@nestjs/common';
import { LoggerService, PageInfoNumber, PrismaService, Logger } from '@/common';
import isEmpty from 'lodash/isEmpty';
import { Config } from './configure.dto';

@Injectable()
export class ConfigureDao {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly log: LoggerService,
  ) {
    this.logger = this.log.getLogger(ConfigureDao.name);
  }

  async checkDuplicatedByName(configName: string) {
    this.logger.info('[checkDuplicatedByName] configName >>', configName);
    const configResult = await this.prismaService.config.findFirst({
      where: {
        name: configName,
      },
    });
    return isEmpty(configResult);
  }

  async getConfigByPage(
    pageSize: string,
    current: string,
  ): Promise<Config | Config[] | PageInfoNumber<Config[]>> {
    this.logger.info(
      '[getConfigByPage] pageSize >> %s, current>> %s',
      pageSize,
      current,
    );
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.config.findMany({
        take: +pageSize,
        skip: +current - 1,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          introduce: true,
          createdAt: true,
          updatedAt: true,
          value: true,
          ConfigType: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prismaService.config.count(),
    ]);

    this.logger.info(' [getConfigByPage] getConfigByPage successfully!!');

    return {
      total,
      data: data.map((dataItem) => {
        return {
          id: dataItem.id,
          name: dataItem.name,
          introduce: dataItem.introduce,
          createdAt: dataItem.createdAt,
          updatedAt: dataItem.updatedAt,
          value: dataItem.value,
          type: dataItem.ConfigType.name,
        };
      }),
      pageNumber: +current,
      pageSize: +pageSize,
    };
  }

  async updateConfig(config: Config) {
    const result = await this.prismaService.config.update({
      data: {
        name: config.name,
        value: config.value,
        introduce: config.introduce,
        ConfigType: {
          connectOrCreate: {
            where: {
              name: config.type,
            },
            create: {
              name: config.type,
            },
          },
        },
      },
      where: {
        id: config.id,
      },
      select: {
        id: true,
      },
    });
    this.logger.info(' [updateConfig] updateConfig successfully!!');
    return result;
  }

  async addConfig(config: Config): Promise<{ id: string }> {
    const result = await this.prismaService.config.create({
      data: {
        name: config.name,
        value: config.value,
        introduce: config.introduce,
        ConfigType: {
          connectOrCreate: {
            where: {
              name: config.type,
            },
            create: {
              name: config.type,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    this.logger.info(' [addConfig] addConfig successfully!!');
    return result;
  }

  async batchDeleteConfig(t: { ids: string[] }): Promise<Record<string, any>> {
    this.logger.info('[batchDeleteConfig] ids >>', t.ids);
    await this.prismaService.config.deleteMany({
      where: {
        id: {
          in: t.ids,
        },
      },
    });
    this.logger.info(' [batchDeleteConfig] batchDeleteConfig successfully!!');
    return {};
  }

  getAllConfigType() {
    return this.prismaService.configType.findMany({});
  }
}
