import { Log4JService } from '@/common';
import { Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'log4js';
import { AuthService } from '../service/auth.service';
import * as OAuth2 from 'oauth2-server';
@Controller('auth')
export class AuthController {
  private logger: Logger;
  constructor(
    private readonly authService: AuthService,
    private readonly Log4js: Log4JService,
  ) {
    this.logger = this.Log4js.getLogger(AuthController.name);
  }

  /**
   * 登录
   * @param req
   * @param resp
   */
  @Post('token')
  async getToken(@Req() req: Request, @Res() resp: Response) {
    const token = await this.authService.getToken(
      new OAuth2.Request(req),
      new OAuth2.Response(resp),
    );
    resp.status(HttpStatus.OK).json(token);
  }

  /**
   * 注销
   * @param req
   * @param resp
   */
  @Get('revoke')
  async removeToken(@Req() req: Request, @Res() resp: Response) {
    return null;
  }

  @Get('valid-mail')
  async checkMail() {}

  /**
   * 验证邮箱code
   */
  @Post('code')
  async checkCode() {}
}
