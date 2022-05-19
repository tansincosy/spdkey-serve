import { QueryParams } from '@/common';

export class ProgramDTO extends QueryParams {
  name: string;
  introduce?: string;
  startTime: string;
  endTime: string;
  channelId?: string;
}
