import { Body, Controller, Post } from '@nestjs/common';
import { DeviceService } from '../service/device.service';
import { DeviceDTO } from '../types/device';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  addClient(@Body() client: DeviceDTO) {
    return this.deviceService.saveDevice(client);
  }
}
