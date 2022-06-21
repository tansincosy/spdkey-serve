import { HttpService } from '@nestjs/axios';
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
import * as OAuth2 from 'oauth2-server';
import { CheckCode, ModifyParam } from '../user/user.dto';
import { AuthModelService } from './auth-model.service';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
@Controller('oauth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authModelService: AuthModelService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

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
