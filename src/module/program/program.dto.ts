import { QueryParams } from '@/common';

export class ProgramDTO extends QueryParams {
  name: string;
  introduce: string | null;
  startTime: string;
  endTime: string;
  channelId: string | null;
}
