import { isEmpty } from 'lodash';
import {
  BaseException,
  Log4JService,
  BasicExceptionCode,
  UserExceptionCode,
} from '@/common';
import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { UserDao } from '../dao/user.dao';
import { RegisterParam } from '../types/controller.param';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as path from 'path';
import * as fs from 'fs';
import { encrypt, encryptedWithPbkdf2, generateTemplateString } from '@/util';
import { CryptoConfig } from '@/config';

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
    const { password } = userParams;

    const cryptoConfig = this.configService.get<CryptoConfig>('crypto');
    const nodeMailerConfig =
      this.configService.get<SMTPTransport.Options>('eMail');

    const encryptPassword = encrypt(
      cryptoConfig.encryptedKey,
      cryptoConfig.encryptedIV,
      password,
    );
    userParams.password = encryptPassword;
    this.log.info('[userRegister] encrypt Password successFully !!');
    const emailCode = await encryptedWithPbkdf2(userParams.email).catch(() => {
      throw new BaseException(BasicExceptionCode.PASS_WORD_ENCRYPTED_SUCCESS);
    });
    const { id } = await this.userDao.userRegister(userParams, emailCode);
    if (!id) {
      this.log.warn('[userRegister] user add failed');
      throw new BaseException(UserExceptionCode.USER_ADD_FAILED);
    }

    this.log.info('[userRegister] user add successFully !!');

    if (
      !isEmpty(this.generateTargetUrl(userParams.username, emailCode)) &&
      nodeMailerConfig.host
    ) {
      const htmlStr = await this.getHTMLContentFromFile('mail');
      const mailContent = this.concatText(htmlStr, {
        userName: userParams.username,
        mail: userParams.email,
        ageLevel: '18',
        validateLink: this.generateTargetUrl(userParams.username, emailCode),
      });
      await this.sendCodeWithMail(userParams.email, mailContent);
    } else {
      this.log.warn(
        "[userRegister] .env can not found mail_host mail_target_host_name, Can't send mail",
      );
    }

    return { id };
  }

  /**
   * 发送邮件
   * @param userEmail
   */
  async sendCodeWithMail(userEmail: string, mailContent: string) {
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
        from: '"stupidonkey 🐴" <stupidonkey@foxmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: 'stupidonkey', // Subject line
        html: mailContent, // html body
      })
      .catch((error) => {
        this.log.error(
          '[sendCodeWithMail] send message by mail failed, message=',
          error,
        );
      });

    this.log.info('[sendCodeWithMail] send message successFully!!');
  }

  generateTargetUrl(username: string, emailCode: string): string {
    const checkCode = Buffer.from(`${username}:${emailCode}`).toString(
      'base64',
    );
    if (process.env.mail_target_host_name) {
      return (
        process.env.mail_target_host_name + `/auth/mail-valid/${checkCode}`
      );
    }
    return '';
  }

  /**
   * 拼接html 文本
   * @param fileName
   * @param fileParam
   * @returns
   */
  async getHTMLContentFromFile(fileName: string) {
    const mailHtmlPath = path.join('resources', `${fileName}.html`);
    let htmlFileText;
    try {
      htmlFileText = await fs.readFileSync(mailHtmlPath);
      htmlFileText = htmlFileText ? htmlFileText.toString() : '';
    } catch (e) {
      htmlFileText = '';
      this.log.error(
        '[getHTMLContentFromFile] readFileSync error, error is : %s',
        e,
      );
    }
    return htmlFileText;
  }

  concatText(htmlStr: string, htmlOpts: Record<string, string>): string {
    const htmlStrByParams = generateTemplateString(htmlStr)({
      ...htmlOpts,
    });
    return htmlStrByParams;
  }

  async forgotPassword(username: string) {
    const user = await this.userDao.findUserByName(username);
    const htmlStr = await this.getHTMLContentFromFile('mail-code');
    const validCode = Math.random().toString().slice(-6);

    const { id } = await this.userDao.updateUserMailCode(username, validCode);

    if (id) {
      const mailContent = this.concatText(htmlStr, {
        userName: username,
        mail: user.email,
        code: validCode,
        ageLevel: '18',
      });
      await this.sendCodeWithMail(user.email, mailContent);
    } else {
      throw new BaseException(
        UserExceptionCode.FORGOT_PASS_TO_MAIL_CODE_FAILED,
      );
    }

    return {
      id: user.id,
    };
  }
}
