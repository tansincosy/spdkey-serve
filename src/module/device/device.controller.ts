import { AuthGuard } from '@/guard/auth.guard';
import { BatchDelDTO } from '@/model/delete.model';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeviceDTO, DeviceParams } from './device.dto';
import { DeviceService } from './device.service';

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
  getClient(@Query() queryParam: DeviceParams) {
    return this.deviceService.pageList(queryParam);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getClientDetail(@Param('id') id: string) {
    return this.deviceService.getDeviceDetail(id);
  }

  @Delete()
  @UseGuards(AuthGuard)
  deleteClient(@Body() { ids }: BatchDelDTO) {
    return this.deviceService.delete({ ids });
  }
}
