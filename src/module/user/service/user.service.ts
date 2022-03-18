import { BaseException, Log4JService, UserExceptionCode } from '@/common';
import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { UserDao } from '../dao/user.dao';
import { RegisterParam } from '../types/controller.param';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
@Injectable()
export class UserService {
  private log: Logger;
  constructor(
    private readonly log4JService: Log4JService,
    private userDao: UserDao,
    private readonly configService: ConfigService,
  ) {
    this.log = this.log4JService.getLogger(UserService.name);
  }

  /**
   * 用户注册
   * @param userParams
   * @returns
   */
  async userRegister(userParams: RegisterParam) {
    const { id } = await this.userDao.userRegister(userParams);
    if (!id) {
      this.log.warn('[userRegister] user add failed');
      throw new BaseException(UserExceptionCode.USER_ADD_FAILED);
    }
    this.log.info('[userRegister] user add successFully !!');
    await this.sendCodeWithMail(userParams.email);
    return { id };
  }

  /**
   * 发送邮件
   * @param userEmail
   */
  async sendCodeWithMail(userEmail: string) {
    this.log.info(
      '[sendCodeWithMail] start send message by mail, mail=',
      userEmail,
    );
    const nodeMailerConfig =
      this.configService.get<SMTPTransport.Options>('eMail');
    this.log.debug('nodeMailerConfig', nodeMailerConfig);
    if (!nodeMailerConfig.host) {
      this.log.warn(
        `There is no configuration for the mailbox in the
        configuration file or there is a problem with the configuration format,
         skip sending the mailbox`,
      );
      return;
    }
    const transporter = nodemailer.createTransport(nodeMailerConfig);
    await transporter
      .sendMail({
        from: '"Fred Foo 👻" <stupidonkey@foxmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>', // html body
      })
      .catch((error) => {
        this.log.error(
          '[sendCodeWithMail] send message by mail failed, message=',
          error,
        );
      });
    this.log.info('[sendCodeWithMail] send message successFully!!');
  }
}
