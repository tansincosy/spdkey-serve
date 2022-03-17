import { Log4JService } from '@/common';
import { Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { UserDao } from '../dao/user.dao';
import { RegisterParam } from '../types/controller.param';
import nodemailer from 'nodemailer';
@Injectable()
export class UserService {
  private log: Logger;
  constructor(
    private readonly log4JService: Log4JService,
    private userDao: UserDao,
  ) {
    this.log = this.log4JService.getLogger(UserService.name);
  }
  async userRegister(userParams: RegisterParam) {
    this.userDao.userRegister();
    this.sendCodeWithMail();
    return null;
  }

  async sendCodeWithMail() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'ss', // generated ethereal user
        pass: '', // generated ethereal password
      },
    });
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: '805841483@qq.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: '<b>Hello world?</b>', // html body
    });

    this.log.info('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    this.log.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
}
