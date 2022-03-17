import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { Log4JService } from '@/common';
import { PrismaService } from '@/common/service/prisma.service';

@Injectable()
export class UserDao {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private log4js: Log4JService,
  ) {
    this.logger = this.log4js.getLogger(UserDao.name);
  }

  async findUserByName(username: string) {
    this.logger.info('[findUserByName] username >>', username);
    const user = await this.prismaService.user.findFirst({
      where: {
        username,
      },
      include: {
        scopes: {
          include: {
            scope: true,
          },
        },
      },
    });
    return user;
  }
}
