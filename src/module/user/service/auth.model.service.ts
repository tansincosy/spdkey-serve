import { BaseException, Log4JService } from '@/common';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import {
  Callback,
  Client,
  Falsey,
  PasswordModel,
  RefreshToken,
  RefreshTokenModel,
  Token,
  User,
} from 'oauth2-server';
import { DeviceDao } from '@/module/device/dao/device.dao';

@Injectable()
export class AuthModelService implements PasswordModel, RefreshTokenModel {
  private logger: Logger;
  constructor(
    private log4js: Log4JService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManger: Cache,
    private readonly configService: ConfigService,
    private readonly deviceDao: DeviceDao,
  ) {
    this.logger = this.log4js.getLogger(AuthModelService.name);
  }
  getRefreshToken(
    refreshToken: string,
    callback?: Callback<RefreshToken>,
  ): Promise<Falsey | RefreshToken> {
    throw new Error('Method not implemented.');
  }
  revokeToken(
    token: Token | RefreshToken,
    callback?: Callback<boolean>,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  generateRefreshToken?(
    client: Client,
    user: User,
    scope: string | string[],
    callback?: Callback<string>,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
  getUser(
    username: string,
    password: string,
    callback?: Callback<User | Falsey>,
  ): Promise<User | Falsey> {
    throw new Error('Method not implemented.');
  }
  validateScope?(
    user: User,
    client: Client,
    scope: string | string[],
    callback?: Callback<string | false | 0>,
  ): Promise<string | false | 0 | string[]> {
    throw new Error('Method not implemented.');
  }
  generateAccessToken?(
    client: Client,
    user: User,
    scope: string | string[],
    callback?: Callback<string>,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async getClient(
    clientId: string,
    clientSecret: string,
  ): Promise<Client | Falsey> {
    this.logger.debug(
      '[getClient.deviceId] >>> ',
      clientId,
      '[getClient.deviceSecret] >>> ',
      clientSecret,
    );
    const client = await this.deviceDao.findDeviceById(clientId);
    if (!client || client.deviceSecret !== clientSecret) {
      this.logger.warn('getClient >>> Invalid client: illegal device');
    }
    throw new Error('Method not implemented.');
  }
  saveToken(
    token: Token,
    client: Client,
    user: User,
    callback?: Callback<Token>,
  ): Promise<Falsey | Token> {
    throw new Error('Method not implemented.');
  }
  getAccessToken(
    accessToken: string,
    callback?: Callback<Token>,
  ): Promise<Falsey | Token> {
    throw new Error('Method not implemented.');
  }
  verifyScope(
    token: Token,
    scope: string | string[],
    callback?: Callback<boolean>,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
