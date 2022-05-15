export enum ChannelConstant {
  M3U_FLAG = '#EXTM3U',
  M3U_INFO_FLAG = '#EXTINF',
}

export const ChannelReg = {
  TVG_URL: /x-tvg-url="(.*?)"/,
  TVG_COUNTRY: /tvg-country="(.*?)"/,
  TVG_ID: /tvg-id="(.*?)"/,
  TVG_LOGO: /tvg-logo="(.*?)"/,
  TVG_LANGUAGE: /tvg-language="(.*?)"/,
  TVG_PLAY_URL: /(http|https).*?(.m3u8)/g,
  TVG_CHANNEL_NAME: /,(.*?)\n/,
  XML_GROUP:
    /<channel id="(.*)"><display-name>(.*)<\/display-name>.*?<icon src="(.*)"\/>.*?<url>(.*)<\/url>/,
};
