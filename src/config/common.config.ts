import { registerAs } from '@nestjs/config';

export interface CommonConfig {
  m3uPath: string;
  programXMLPath: string;
}

export const CommonConfig = registerAs('appConfig', () => ({
  m3uPath: 'tmp/m3u',
  programXMLPath: 'tmp/program',
}));
