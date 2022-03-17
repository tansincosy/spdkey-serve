import { Injectable } from '@nestjs/common';
import * as OAuth2 from 'oauth2-server';
import { Log4JService } from '@/common';
import { Logger } from 'log4js';
import { AuthModelService } from './auth-model.service';
@Injectable()
export class AuthService {
  private logger: Logger;
  constructor(
    private readonly modelService: AuthModelService,
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
}
