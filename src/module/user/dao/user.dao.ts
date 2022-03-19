import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { Log4JService } from '@/common';
import { PrismaService } from '@/common/service/prisma.service';
import { RegisterParam } from '../types/controller.param';
import { HAS_VALID, UserIsValid, UserLocked } from '../types/constant';

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
        isLocked: UserLocked.LOCKED,
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
}
