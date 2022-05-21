import { Injectable } from '@nestjs/common';
import { LoggerService, PrismaService, Logger } from '@/common';
import { RegisterParam } from './user.dto';
import { HAS_VALID, UserIsValid, UserLocked } from '@/constant';

@Injectable()
export class UserDao {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
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
        isValid: UserIsValid.NOT_ALLOW,
        isLocked: UserLocked.UN_LOCK,
        scopes: {
          create: {
            scope: {
              create: {
                name: 'web',
              },
            },
          },
        },
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
        isValid: UserIsValid.ALLOW,
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
        isValid: true,
        updatedAt: true,
        createdAt: true,
        scopes: {
          select: {
            scope: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        devices: {
          select: {
            Device: {
              select: {
                name: true,
                isOnline: true,
                isLocked: true,
                id: true,
                type: true,
              },
            },
          },
        },
        deviceLimit: true,
      },
    });

    return {
      ...userDetail,
      devices: userDetail.devices.map((item) => {
        return {
          name: item.Device.name,
          isOnline: item.Device.isOnline,
          isLocked: item.Device.isLocked,
          type: item.Device.type,
          id: item.Device.id,
        };
      }),
      scopes: userDetail.scopes.map((item) => {
        return item.scope.name;
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
    const delUserOnDevice = this.prismaService.userOnDevice.deleteMany({
      where: {
        userId: {
          in: ids,
        },
      },
    });

    const delUserOnScope = this.prismaService.scopeOnUser.deleteMany({
      where: {
        userId: {
          in: ids,
        },
      },
    });

    await this.prismaService.$transaction([
      delUserOnDevice,
      delUserOnScope,
      delUser,
    ]);
    this.logger.info('batchDelUser success');
    return {};
  }
}
