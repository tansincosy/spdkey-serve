import { registerAs } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Config from './yaml.config';

const appConfig = Config();

const mail = appConfig?.mail || {};

export const mailConfig: SMTPTransport | SMTPTransport.Options = {
  host: mail?.host || '',
  port: mail?.port || 465,
  logger: true,
  connectionTimeout: 10000,
  secure: mail?.secure, // true for 465, false for other ports
  auth: {
    user: mail?.user || '', // generated ethereal user
    pass: mail?.pass || '', // generated ethereal password
  },
};
export const EmailConfig = registerAs<SMTPTransport | SMTPTransport.Options>(
  'eMail',
  () => mailConfig,
);
