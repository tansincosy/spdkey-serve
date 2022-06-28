import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { atob, btoa, encrypt, encryptedWithPbkdf2, joinKey } from '@/util';
import { UserDao } from '../user/user.dao';
import { CheckCode, ModifyParam } from '../user/user.dto';
import { Logger, LoggerService } from '@/processor/log4j/log4j.service';
import {
  BasicExceptionCode,
  UserExceptionCode,
} from '@/constant/error-code.constant';
import { BaseException } from '@/exception/base.exception';
import { HAS_VALID } from '@/constant/user.constant';
import { Encrypted } from '@/interface/app-config.interface';
@Injectable()
export class AuthService {
  private logger: Logger;
  constructor(
    private readonly userDao: UserDao,
    private readonly log4js: LoggerService,
    private readonly configService: ConfigService,
  ) {
    this.logger = this.log4js.getLogger(AuthService.name);
  }

  async checkMail(checkCode: string): Promise<{ id: string }> {
    const checkCodeStr = Buffer.from(checkCode, 'base64').toString();
    const [username, mailCode] = checkCodeStr.split(':');
    if (!username && !mailCode) {
      this.logger.warn('[checkMail] check mail failed!!');
      throw new BaseException(BasicExceptionCode.CHECK_CODE_ERROR);
    }
    const user = await this.userDao.findUserByName(username);
    if (user.emailCode === HAS_VALID) {
      this.logger.warn('[checkMail] email has been validated!!');
      throw new BaseException(BasicExceptionCode.EMAIL_HAS_BEEN_VALID);
    }
    if (user.emailCode !== mailCode) {
      this.logger.error('[checkMail] mail code is not equal!!');
      throw new BaseException(BasicExceptionCode.CHECK_CODE_ERROR);
    }
    const { id } = await this.userDao.updateUserValid(username);
    this.logger.info("[checkMail] update user's  valid successfully!!");
    return { id };
  }

  async checkMailCode(checkCode: CheckCode) {
    const { emailCode } = await this.userDao.findUserByUsernameAndEMail(
      checkCode.username,
      checkCode.email,
    );
    if (emailCode && emailCode === checkCode.emailCode) {
      let generateNewMailCode = '';
      try {
        generateNewMailCode = await encryptedWithPbkdf2(checkCode.username);
      } catch (error) {
        this.logger.error('[checkMailCode] encryptedWithPbkdf2 failed');
        throw new BaseException(UserExceptionCode.VERIFY_CODE_ERROR);
      }

      const newJoinKey = joinKey(
        checkCode.username,
        checkCode.email,
        generateNewMailCode,
      );
      const newMailCode = btoa(newJoinKey);
      this.logger.debug('[checkMailCode] begin set new mail code');
      //设置新的 mailcode 为修改密码做准备
      await this.userDao.updateUserMailCode(checkCode.username, newMailCode);
      return {
        authCode: newMailCode,
      };
    } else {
      this.logger.warn(
        '[checkMailCode] check code verifycode is [%s], db verifycode is [%s]',
        checkCode.emailCode,
        emailCode,
      );
      throw new BaseException(UserExceptionCode.VERIFY_CODE_ERROR);
    }
  }

  async modifyPassword(modifyParam: ModifyParam): Promise<{ id: string }> {
    this.logger.debug('[modifyPassword] begin modify password');
    const { password, authCode } = modifyParam;
    const authCodeStr = atob(authCode);
    const [username, email, newMailCode] = authCodeStr.split(':');
    if (!username || !email || !newMailCode) {
      this.logger.warn(
        '[modifyPassword] username = %s, email = %s, newMailCode = %s',
        username,
        email,
        newMailCode,
      );
      throw new BaseException(BasicExceptionCode.UPDATE_PASSWORD_FAILED);
    }

    const { emailCode } = await this.userDao.findUserByUsernameAndEMail(
      username,
      email,
    );
    if (emailCode === HAS_VALID) {
      this.logger.warn(
        '[modifyPassword] mailCode is not equal, has been valid',
      );
      throw new BaseException(BasicExceptionCode.EMAIL_HAS_BEEN_VALID);
    }
    if (emailCode !== modifyParam.authCode) {
      this.logger.warn(
        '[modifyPassword] mailCode is not equal, emailCode = %s, authCode = %s',
        emailCode,
        newMailCode,
      );
      throw new BaseException(BasicExceptionCode.UPDATE_PASSWORD_FAILED);
    }

    const cryptoConfig = this.configService.get<Encrypted>('encrypted');
    const encryptPassword = encrypt(cryptoConfig.key, password);

    const { id } = await this.userDao.updateUserPassword(
      username,
      encryptPassword,
    );
    if (!id) {
      this.logger.warn('[modifyPassword] update db failed!!');
      throw new BaseException(BasicExceptionCode.UPDATE_PASSWORD_FAILED);
    }
    await this.userDao.updateUserValid(username);
    this.logger.info('[modifyPassword] update password successfully !!');
    return { id };
  }
}
