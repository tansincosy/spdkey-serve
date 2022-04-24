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

  async findUserById(userId: string) {
    this.logger.info('[findUserById] enter');
    this.logger.debug('updateUserMailCode userId = ', userId);
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
      },
    });
  }
}
