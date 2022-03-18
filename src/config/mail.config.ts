import { registerAs } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const mailConfig: SMTPTransport | SMTPTransport.Options | string = {
  host: process.env.mail_host,
  port: +process.env.mail_port || 465,
  logger: true,
  connectionTimeout: 10000,
  secure: process.env.mail_secure === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.mail_auth_user, // generated ethereal user
    pass: process.env.mail_auth_pass, // generated ethereal password
  },
};
export const EmailConfig = registerAs('eMail', () => mailConfig);
