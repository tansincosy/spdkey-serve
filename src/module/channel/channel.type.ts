export interface M3uChannel {
  channelId?: string;
  logo?: string;
  name?: string;
  language?: string;
  country?: string;
  playUrl?: string;
  m3UId?: string;
  // status?: string;
}

export interface EpgUrl {
  name?: string;
  url?: string;
}

export interface EpgChannel extends M3uChannel {
  epgUrlId?: string;
}
