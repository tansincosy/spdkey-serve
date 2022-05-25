import { excludePagination, generateQueryParam, likeQuery } from '@/util';
import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ConfigDTO, ConfigQueryDTO } from './configure.dto';
import { Config } from '@prisma/client';
import { Pagination, QueryPagination } from '@/interface/page-info.interface';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import { PrismaService } from '@/processor/database/prisma.service';

@Injectable()
export class ConfigureDao implements QueryPagination<ConfigQueryDTO, Config> {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly log: LoggerService,
  ) {
    this.logger = this.log.getLogger(ConfigureDao.name);
  }

  async pageList(
    query: ConfigQueryDTO,
  ): Promise<Pagination<Partial<Config>[]>> {
    const queryParams = generateQueryParam(query);
    const where = {
      ...likeQuery<Config>(query, 'name'),
      ...excludePagination(query),
    };
    const configList = this.prismaService.config.findMany({
      ...queryParams,
      where,
      select: {
        id: true,
        name: true,
        value: true,
        updatedAt: true,
        createdAt: true,
        introduce: true,
        ConfigType: {
          select: {
            name: true,
          },
        },
      },
    });
    const deviceCount = this.prismaService.config.count({
      ...queryParams,
      where,
    });
    const [data, total] = await this.prismaService.$transaction([
      configList,
      deviceCount,
    ]);
    return {
      total,
      data: data.map((item) => {
        return {
          ...item,
          type: item.ConfigType.name,
        };
      }),
      pageSize: query.pageSize,
      pageNumber: query.current,
    };
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

  async updateConfig(config: ConfigDTO) {
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

  async addConfig(config: ConfigDTO): Promise<{ id: string }> {
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
