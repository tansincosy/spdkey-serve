import { AuthModelService } from './../service/auth-model.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import * as OAuth2 from 'oauth2-server';
import { CheckCode, ModifyParam } from '../types/controller.param';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authModelService: AuthModelService,
  ) {}

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
  @Post('revoke')
  async removeToken(@Req() req: Request, @Res() resp: Response) {
    await this.authModelService.revokeTokenForLogin(req);
    resp.status(HttpStatus.OK).json({});
  }
  /**
   * 邮箱跳转地址
   */
  @Get('mail-valid/:mailCode')
  async checkMail(@Param('mailCode') mailCode: string) {
    return this.authService.checkMail(mailCode);
  }

  /**
   * 修改密码时，验证的邮箱code
   */
  @Post('mail-code')
  async checkCode(@Body() checkCode: CheckCode) {
    return this.authService.checkMailCode(checkCode);
  }

  @Post('modify-password')
  async modifyPassword(@Body() modifyParam: ModifyParam) {
    return this.authService.modifyPassword(modifyParam);
  }
}
