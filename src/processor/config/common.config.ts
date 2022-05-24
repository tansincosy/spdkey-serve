import { CONFIG_KEY } from '@/constant';
import { registerAs } from '@nestjs/config';
import appConfig from './yaml.config';

const config = appConfig();

const appDataPath = config?.app.data || '';
export interface CommonConfig {
  m3uPath: string;
  programXMLPath: string;
  allowChannelPath: string;
  logoPath: string;
}

export const CommonConfig = registerAs<CommonConfig>(
  CONFIG_KEY.APP_CONFIG,
  () => ({
    m3uPath: `${appDataPath}/channel/m3u`,
    logoPath: `${appDataPath}/channel/channel_logo`,
    programXMLPath: `${appDataPath}/channel/program`,
    allowChannelPath: `${appDataPath}/channel/all_channel`,
  }),
);
