import { CONFIG_KEY } from '@/constant';
import { registerAs } from '@nestjs/config';

export interface CommonConfig {
  m3uPath: string;
  programXMLPath: string;
  allowChannelPath: string;
  logoPath: string;
}

export const CommonConfig = registerAs(CONFIG_KEY.APP_CONFIG, () => ({
  m3uPath: 'tmp/m3u',
  logoPath: 'tmp/channel_logo',
  programXMLPath: 'tmp/program',
  allowChannelPath: 'tmp/allowChannels',
}));
