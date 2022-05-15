import { CONFIG_KEY } from '@/constant';
import { registerAs } from '@nestjs/config';

export interface CommonConfig {
  m3uPath: string;
  programXMLPath: string;
  allowChannelPath: string;
  logoPath: string;
}

export const CommonConfig = registerAs(CONFIG_KEY.APP_CONFIG, () => ({
  m3uPath: 'app_data/channel/m3u',
  logoPath: 'app_data/channel/channel_logo',
  programXMLPath: 'app_data/channel/program',
  allowChannelPath: 'app_data/channel/all_channel',
}));
