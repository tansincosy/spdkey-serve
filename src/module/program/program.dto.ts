import { PaginateBaseDTO } from '@/model/paginate.model';

export class ProgramDTO extends PaginateBaseDTO {
  name: string;
  introduce?: string;
  startTime: string;
  endTime: string;
  channelId?: string;
}
