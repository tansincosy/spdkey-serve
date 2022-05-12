export interface M3uChannel {
  channelId?: string;
  logo?: string;
  name?: string;
  language?: string;
  country?: string;
  playUrl?: string;
  m3UId?: string;
  id?: string;
  // status?: string;
}

export interface EpgUrl {
  name?: string;
  url?: string;
}

export interface EpgChannel extends M3uChannel {
  epgUrlId?: string;
}

export interface M3U {
  id?: string;
  name?: string;
  url?: string;
}
