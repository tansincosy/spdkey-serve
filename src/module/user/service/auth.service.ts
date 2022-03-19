import { Injectable } from '@nestjs/common';
import * as OAuth2 from 'oauth2-server';
import { BaseException, BasicExceptionCode, Log4JService } from '@/common';
import { Logger } from 'log4js';
import { AuthModelService } from './auth-model.service';
import { UserDao } from '../dao/user.dao';
import { HAS_VALID } from '../types/constant';
@Injectable()
export class AuthService {
  private logger: Logger;
  constructor(
    private readonly modelService: AuthModelService,
    private readonly userDao: UserDao,
    private readonly log4js: Log4JService,
  ) {
    this.logger = this.log4js.getLogger(AuthService.name);
  }

  getOAuthClient() {
    return new OAuth2({
      model: this.modelService,
    });
  }
  /**
   * token 登录
   * @param request
   * @param response
   * @returns
   */
  async getToken(request: OAuth2.Request, response: OAuth2.Response) {
    const resultToken = await this.getOAuthClient().token(request, response);
    return {
      accessToken: resultToken.accessToken,
      refreshToken: resultToken.refreshToken,
      expiredIn: resultToken.client.accessTokenLifetime,
      type: 'Bearer',
    };
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
}
