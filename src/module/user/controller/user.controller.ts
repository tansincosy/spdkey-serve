import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { RegisterParam } from '../types/controller.param';
/**
 * notice:
 * TODO: 【1】：用户登录 [pass]
 *             用户登录 [pass]
 *                   设置refresh access
 *                       if autologin by refreshToken --> access [remove old refresh]
 *                          else access
 *                          if access expire -> by refresh get access [remove old refresh]
 *        【2】：用户注册
 *               enter username passwd and email then by email code get visible
 *        【3】：用户改密码
 *              enter email code target modify passwd website
 *        【4】： 用户注销 [pass]
 *               user logout -> remove refresh and access
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**
   * 用户注册
   * @param userParam
   * @returns
   */
  @Post('register')
  userRegister(@Body() userParam: RegisterParam) {
    return this.userService.userRegister(userParam);
  }

  @Post('secret')
  modifyPass() {}
}
