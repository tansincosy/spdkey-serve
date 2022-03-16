import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
/**
 * notice:
 * TODO: 【1】：用户登录
 *             用户登录
 *                   设置refresh access
 *                       if autologin by refreshToken --> access [remove old refresh]
 *                          else access
 *                          if access expire -> by refresh get access [remove old refresh]
 *        【2】：用户注册
 *               enter username passwd and email then by email code get visible
 *        【3】：用户改密码
 *              enter email code target modify passwd website
 *        【4】： 用户注销
 *               user logout -> remove refresh and access
 */
@Controller('oauth')
export class AuthController {
  /**
   * 登录
   * @param req
   * @param resp
   */
  @Post('token')
  async getToken(@Req() req: Request, @Res() resp: Response) {
    return null;
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
}
