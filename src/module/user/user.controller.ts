import { DeleteIdPrams } from '@/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { RegisterParam, UserQueryParam } from './user.dto';
import { UserService } from './user.service';
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

  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@Req() req: Request, @Res() resp: Response) {
    this.userService.getCurrentUser(req, resp);
  }

  @Get()
  getUsers(@Query() userQuery: UserQueryParam) {
    return this.userService.pageList(userQuery);
  }

  @Get(':id')
  getUserDetail(@Param('id') id: string) {
    return this.userService.getUserDetail(id);
  }

  @Delete()
  batchDelUser(@Body() { ids }: DeleteIdPrams) {
    return this.userService.batchDelUser(ids);
  }
}
