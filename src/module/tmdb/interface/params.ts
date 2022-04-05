export interface TMDBConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
}

export enum Config {
  image = '',
  countries = 'countries',
  languages = 'languages',
  translation = 'primary_translations',
  timezones = 'timezones',
}

export type Genre = {
  id: number;
  name: string;
};

export type ProductionCompany = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

export type ProductionCountry = {
  name: string;
};
export type SpokenLanguages = {
  name: string;
};

export type Movie = {
  adult?: boolean;
  backdrop_path?: string;
  belongs_to_collection?: null | typeof Object;
  budget?: number;
  genres?: Genre[];
  homepage?: string;
  id?: number;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string | null;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  release_date?: string;
  revenue?: string;
  runtime?: number;
  spoken_languages?: SpokenLanguages[];
  status?: string;
  tagline?: string;
  title?: string;
  video?: false;
  vote_average?: number;
  vote_count?: number;
  seasons?: Season[];
};

export type Season = {
  air_date?: string;
  episode_count?: string;
  id?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  season_number?: string;
};

type ImageItem = {
  aspect_ratio?: number;
  file_path?: string;
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
};

export type Image = {
  backdrops?: ImageItem[];
  posters?: ImageItem[];
};

export enum SourceType {
  tv = 'tv',
  movie = 'movie',
}

export interface SourceBody {
  images: {
    href: string;
    type: number;
  }[];
  sourceType: SourceType;
  sourceId: number;
}

export interface Cast {
  adult?: boolean;
  gender?: number;
  id?: number;
  known_for_department?: string;
  name?: string;
  original_name?: string;
  popularity?: number;
  profile_path?: string;
  character?: string;
  credit_id?: string;
  order?: number;
}

export interface Crew extends Cast {
  known_for_department?: string;
  department?: string;
  credit_id?: string;
  job?: string;
}

export type Credit = {
  cast?: Cast[];
  crew?: Crew[];
  id?: string;
};
