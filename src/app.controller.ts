import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { OAuth2Guard } from './guard/oAuth2.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(OAuth2Guard)
  getHello() {
    return this.appService.getHello();
  }
}
