import { AuthGuard } from '@/module/user';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DeviceService } from '../service/device.service';
import { DeviceDTO } from '../types/device';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  addClient(@Body() client: DeviceDTO) {
    return this.deviceService.saveDevice(client);
  }

  @Get('/private')
  @UseGuards(AuthGuard)
  getPrivateDate() {
    return 'private data';
  }
}
