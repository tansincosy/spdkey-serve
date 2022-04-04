import { QueryParams } from '@/common';
import { AuthGuard } from '@/module/user';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from '../service/device.service';
import { DeviceDTO } from '../types/device';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  addClient(@Body() client: DeviceDTO) {
    return this.deviceService.saveDevice(client);
  }

  @Put()
  updateClient(@Body() client: DeviceDTO) {
    return this.deviceService.updateDevice(client);
  }

  @Get()
  @UseGuards(AuthGuard)
  getClient(@Query() { current, pageSize, id }: QueryParams) {
    return this.deviceService.getList({ current, pageSize, id });
  }

  @Delete()
  @UseGuards(AuthGuard)
  deleteClient(@Body() { ids }: { ids: string[] }) {
    return this.deviceService.delete({ ids });
  }
}
