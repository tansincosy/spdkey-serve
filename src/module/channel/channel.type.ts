export interface M3uChannel {
  channelId?: string;
  logo: string;
  name: string;
  language: string;
  country: string;
  playUrl: string;
  m3UId: string;
}

export interface EpgUrl {
  name?: string;
  url?: string;
}
