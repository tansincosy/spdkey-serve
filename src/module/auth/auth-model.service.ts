import { BaseException, Logger, LoggerService } from '@/common';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import OAuth2Server, {
  Client,
  Falsey,
  InvalidClientError,
  PasswordModel,
  RefreshToken,
  RefreshTokenModel,
  Token,
  User,
} from 'oauth2-server';
import { isEmpty } from 'lodash';
import { sign } from 'jsonwebtoken';
import { format } from 'util';
import { decrypt, secretMask, atob } from '@/util';
import { CryptoConfig } from '@/config';
import { Request } from 'express';
import { DeviceDao } from '../device/device.dao';
import { UserDao } from '../user/user.dao';
import { BasicExceptionCode, UserLocked } from '@/constant';

enum DeviceStatus {
  LOCKED = 1,
  UNLOCKED = 0,
}

const formats = {
  client: 'clients:%s',
  token: 'tokens:%s',
  user: 'users:%s',
};
@Injectable()
export class AuthModelService implements PasswordModel, RefreshTokenModel {
  private logger: Logger;
  constructor(
    private logService: LoggerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManger: Cache,
    private readonly configService: ConfigService,
    private readonly deviceDao: DeviceDao,
    private readonly userDao: UserDao,
  ) {
    this.logger = this.logService.getLogger(AuthModelService.name);
  }

  async getRefreshToken(refreshToken: string): Promise<Falsey | RefreshToken> {
    this.logger.debug(
      '[getRefreshToken] refreshToken = ',
      secretMask(refreshToken, 10),
    );
    const token = await this.cacheManger.get<OAuth2Server.Token>(
      format(formats.token, refreshToken),
    );

    this.logger.debug('[getRefreshToken] token = %s', token);

    if (isEmpty(token)) {
      this.logger.warn('[getRefreshToken] token is empty');
      throw new BaseException(BasicExceptionCode.REFRESH_TOKEN_INVALID);
    }

    return {
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: new Date(token.refreshTokenExpiresAt),
      scope: token.scope,
      client: {
        id: token.clientId,
        grants: token.grants,
      },
      user: {
        id: token.userId,
        scope: token.userScope,
      },
    };
  }

  async revokeTokenForLogin(req: Request) {
    const authorization = req.headers.authorization;

    const accessToken = req.body.accessToken;

    const [tokenType, clientBasic64] = authorization.split(' ');
    if (tokenType !== 'Basic') {
      throw new InvalidClientError(
        'Invalid client: cannot retrieve client credentials',
      );
    }
    const clientTokenStr = atob(clientBasic64);
    const [clientId, clientSecret] = clientTokenStr.split(':');

    this.logger.info('revokeTokenForLogin validation client');
    await this.getClient(clientId, clientSecret);

    this.logger.debug(
      '[revokeToken4Login] accessToken = %s',
      secretMask(accessToken, 20),
    );
    const getAccessTokenValue = await this.cacheManger.get<OAuth2Server.Token>(
      format(formats.token, accessToken),
    );
    if (isEmpty(getAccessTokenValue)) {
      this.logger.warn('[revokeToken4Login] getAccessTokenValue is empty');
      return {};
    }
    this.logger.info('============== begin del accessToken =================');
    await this.cacheManger.del(
      format(formats.token, getAccessTokenValue.accessToken),
    );
    this.logger.info('============== end del accessToken ====================');

    this.logger.info('============== begin del refreshToken ===============');
    await this.cacheManger.del(
      format(formats.token, getAccessTokenValue.refreshToken),
    );
    this.logger.info('============== end del refreshToken ===============');
    return {};
  }

  async revokeToken(token: Token | RefreshToken): Promise<boolean> {
    this.logger.info('[revokeToken] enter');
    this.logger.debug('[revokeToken] token = %s', token);
    const result = await this.cacheManger.del(
      format(formats.token, token.refreshToken),
    );
    this.logger.debug('[revokeToken] result= %s', result);
    return result === 1;
  }

  generateRefreshToken?(
    client: Client,
    user: User,
    scope: string | string[],
  ): Promise<string> {
    const refreshKey = this.configService.get(
      'crypto.refreshToken',
    ) as unknown as string;
    return sign(
      {
        ...client,
        ...user,
        scope,
      },
      refreshKey,
    );
  }

  async getUser(username: string, password: string): Promise<User | Falsey> {
    this.logger.info('get  user pass from db');
    const user = await this.userDao.findUserByName(username);
    if (isEmpty(user)) {
      this.logger.warn('find user is empty');
      throw new BaseException(BasicExceptionCode.USERNAME_OR_PASSWORD_IS_ERROR);
    }
    const cryptoConfig = this.configService.get<CryptoConfig>('crypto');
    this.logger.debug(
      '[getUser] cryptoConfig encryptedKey = ',
      secretMask(cryptoConfig.encryptedKey),
    );
    const decryptPassword = decrypt(cryptoConfig.encryptedKey, user.password);
    this.logger.debug('[getUser] dePass = %s', secretMask(decryptPassword));
    if (password !== decryptPassword) {
      this.logger.warn("[getUser] user's password is wrong");
      throw new BaseException(BasicExceptionCode.USERNAME_OR_PASSWORD_IS_ERROR);
    }

    if (+user.isLocked === UserLocked.LOCKED) {
      this.logger.warn('[getUser] user is locked');
      throw new BaseException(BasicExceptionCode.USER_HAD_LOCKED);
    }
    return {
      id: user.id,
      scope: user.scopes.map((item) => {
        return item.scope.name;
      }),
    };
  }
  async validateScope?(
    user: User,
    client: Client,
    scope: string,
  ): Promise<string | false | 0 | string[]> {
    this.logger.info('[validateScope] enter');
    this.logger.debug('[validateScope] user = %s', user.scope);
    this.logger.debug('[client] = %s  [scope] = %s', user, client, scope);
    if (!scope) {
      throw new BaseException(BasicExceptionCode.SCOPE_INVALID);
    }
    const isPassed = scope
      .split(':')
      .filter((s) => user.scope.indexOf(s) >= 0)
      .join(' ');
    if (!isPassed) {
      this.logger.warn('Invalid scope');
      throw new BaseException(BasicExceptionCode.SCOPE_IS_WRONG);
    }
    return isPassed;
  }

  generateAccessToken?(
    client: Client,
    user: User,
    scope: string | string[],
  ): Promise<string> {
    this.logger.debug(
      'jwt.key.token.access',
      this.configService.get('crypto.accessToken'),
    );
    const accessKey = this.configService.get(
      'crypto.accessToken',
    ) as unknown as string;

    return sign(
      {
        ...client,
        ...user,
        scope,
      },
      accessKey,
    );
  }

  /**
   * 验证设备
   * @param clientId
   * @param clientSecret
   * @returns
   */
  async getClient(
    clientId: string,
    clientSecret: string,
  ): Promise<Client | Falsey> {
    this.logger.debug(
      '[getClient.deviceId] >>> ',
      secretMask(clientId, 10),
      '[getClient.deviceSecret] >>> ',
      secretMask(clientSecret, 20),
    );
    const client = await this.deviceDao.findDeviceById(clientId);
    if (isEmpty(client) || client.deviceSecret !== clientSecret) {
      this.logger.debug('db deviceSecret is isEmpty? = ', isEmpty(client));
      this.logger.warn('getClient >>> Invalid client: illegal device');
      throw new BaseException(BasicExceptionCode.CLIENT_INVALID);
    }
    if (client.isLocked === DeviceStatus.LOCKED) {
      this.logger.warn('getClient >>> Invalid client: CLIENT_HAD_LOCKED');
      throw new BaseException(BasicExceptionCode.CLIENT_HAD_LOCKED);
    }
    const grants = client.grants;
    return {
      id: client.id,
      accessTokenLifetime: client.accessTokenValidateSeconds,
      refreshTokenLifetime: client.refreshTokenValidateSeconds,
      grants: grants.map((item) => item.grant.name),
    };
  }

  async saveToken(
    token: Token,
    client: Client,
    user: User,
  ): Promise<Falsey | Token> {
    this.logger.info('[saveToken] enter');

    this.logger.info('[saveToken] save redis start ======>');
    const redisToken = {
      ...token,
      clientId: client.id,
      grants: client.grants,
      userId: user.id,
      userScope: user.scope,
    };

    const hasUserLinkClient =
      await this.deviceDao.findUserDeviceByClientIdAndUserId(
        client.id,
        user.id,
      );

    if (isEmpty(hasUserLinkClient)) {
      this.logger.info('[saveToken] update client link user id');
      await this.deviceDao.saveDeviceLinkUserWithClientIdAndUserId(
        client.id,
        user.id,
      );
    }

    const redisAccessKey = format(formats.token, token.accessToken);
    const redisRefreshKey = format(formats.token, token.refreshToken);

    await this.cacheManger.set(redisAccessKey, redisToken, {
      ttl: client.refreshTokenLifetime,
    });
    this.logger.debug(
      '[saveToken] redisAccessKey = %s',
      secretMask(redisAccessKey, 20),
    );
    this.logger.debug('[saveToken] accessTokenLifetime', token);
    this.logger.debug('[saveToken] client', client);
    this.logger.info('[saveToken] save redis accessToken success');
    await this.cacheManger.set(redisRefreshKey, redisToken, {
      ttl: client.refreshTokenLifetime,
    });

    this.logger.info('[saveToken] save redis refreshToken success');

    this.logger.info('[saveToken] token  saved ended <======');

    return {
      ...token,
      client,
      user,
    };
  }
  async getAccessToken(accessToken: string): Promise<Falsey | Token> {
    this.logger.info('[getAccessToken] - enter');

    this.logger.info('[accessToken] = ', secretMask(accessToken, 32));

    const token = await this.cacheManger.get<OAuth2Server.Token>(
      format(formats.token, accessToken),
    );

    if (isEmpty(token)) {
      this.logger.warn('[getAccessToken] - token is empty');
      throw new BaseException(BasicExceptionCode.TOKEN_INVALID);
    }

    this.logger.debug(
      '[getAccessToken] token = %s , token.grants = %s',
      token,
      token.grants,
    );

    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
      scope: token.scope,
      client: {
        id: token.clientId,
        grants: token.grants,
      },
      user: {
        id: token.userId,
        scope: token.userScope,
      },
    };
  }
  async verifyScope(token: Token, scope: string | string[]): Promise<boolean> {
    this.logger.info('[verifyScope] enter');
    if (!scope) {
      this.logger.warn('scope is empty');
      throw new BaseException(BasicExceptionCode.SCOPE_INVALID);
    }
    const { user } = token;
    const serverScope = user.scope.split(',');
    if (!serverScope.includes(scope)) {
      this.logger.warn('[verifyScope] Invalid scope');
      throw new BaseException(BasicExceptionCode.SCOPE_INVALID);
    }
    return true;
  }
}
