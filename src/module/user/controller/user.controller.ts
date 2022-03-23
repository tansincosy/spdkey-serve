import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { RegisterParam } from '../types/controller.param';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  userRegister(@Body() userParam: RegisterParam) {
    return this.userService.userRegister(userParam);
  }

  @Get('/:username/forgot-password')
  forgotPassword(@Param('username') username: string) {
    return this.userService.forgotPassword(username);
  }
}
