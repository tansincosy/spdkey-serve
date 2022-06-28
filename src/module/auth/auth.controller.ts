import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { CheckCode, ModifyParam } from '../user/user.dto';
import { AuthService } from './auth.service';
@Controller('oauth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
