import { API } from '@/constant';
import { Controller, Get, Query } from '@nestjs/common';
import { ProgramDTO } from './program.dto';
import { ProgramService } from './program.service';

@Controller(API.PLAYBILL)
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  getPlaybills(@Query() playbillQuery: ProgramDTO) {
    return this.programService.pageList(playbillQuery);
  }
}
