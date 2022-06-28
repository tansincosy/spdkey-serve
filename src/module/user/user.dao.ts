import { PrismaOauthService } from '@/processor/database/prisma.service.oauth';
import { HAS_VALID, UserIsValid } from '@/constant/user.constant';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import { Injectable } from '@nestjs/common';
import { RegisterParam } from './user.dto';

@Injectable()
export class UserDao {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaOauthService,
    private log4js: LoggerService,
  ) {
    this.logger = this.log4js.getLogger(UserDao.name);
  }

  async findUserByName(username: string) {
    this.logger.info('[findUserByName] username >>', username);
    const user = await this.prismaService.user.findFirst({
      where: {
        username,
      },
    });
    return user;
  }

  async userRegister(
    userParam: RegisterParam,
    emailCode: string,
  ): Promise<{ id?: string }> {
    this.logger.info('[userRegister] userRegister');
    const createSave = await this.prismaService.user.create({
      data: {
        username: userParam.username,
        password: userParam.password,
        email: userParam.email,
        emailCode,
      },
      select: {
        id: true,
      },
    });
    return createSave || {};
  }

  async updateUserValid(username: string): Promise<{ id: string }> {
    this.logger.info('[updateUserValidStatus] updateUserValidStatus');
    return await this.prismaService.user.update({
      data: {
        enable: UserIsValid.NOT_ALLOW,
        emailCode: HAS_VALID,
      },
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
  }

  async updateUserMailCode(username: string, mailCode: string) {
    this.logger.info('[updateUserMailCode] updateUserMailCode');
    this.logger.debug(
      'updateUserMailCode username = %s , mailCode = %s',
      username,
      mailCode,
    );

    return await this.prismaService.user.update({
      data: {
        emailCode: mailCode,
      },
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
  }

  async findUserByUsernameAndEMail(username: string, email: string) {
    return await this.prismaService.user.findFirst({
      where: {
        username,
        email,
      },
    });
  }

  async updateUserPassword(username: string, password: string) {
    return await this.prismaService.user.update({
      data: {
        password,
      },
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
  }

  findUserById(userId: string) {
    this.logger.info('[findUserById] enter');
    this.logger.debug('updateUserMailCode userId = ', userId);
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
      },
    });
  }

  async getUserDetail(id: string) {
    this.logger.debug('getUserDetail id = %s', id);
    const userDetail = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isLocked: true,
        enable: true,
        updatedAt: true,
        createdAt: true,
        terminals: {
          include: {
            OAuthTerminal: {
              select: {
                id: true,
                os: true,
                type: true,
                name: true,
                isLocked: true,
                isOnline: true,
              },
            },
          },
        },
      },
    });

    return {
      ...userDetail,
      devices: userDetail.terminals.map((item) => {
        return {
          name: item.OAuthTerminal.name,
          isOnline: item.OAuthTerminal.isOnline,
          isLocked: item.OAuthTerminal.isLocked,
          type: item.OAuthTerminal.type,
          id: item.OAuthTerminal.id,
        };
      }),
    };
  }

  async batchDelUser(ids: string[]) {
    this.logger.info('batchDelUser ids = %s', ids);
    const delUser = this.prismaService.user.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    const delUserOnDevice = this.prismaService.userOnTerminal.deleteMany({
      where: {
        userId: {
          in: ids,
        },
      },
    });

    await this.prismaService.$transaction([delUserOnDevice, delUser]);
    this.logger.info('batchDelUser success');
    return {};
  }
}
