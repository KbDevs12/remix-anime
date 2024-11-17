export interface AnimeLink {
  href: string;
  title: string;
  image: string;
  id?: string;
}

export interface parseStreaming {
  title?: string;
  id?: string;
  streamLink: [];
}

export interface detailsAnimeEps {
  type: string;
  tigaEnam: string;
  tujuhDua: string;
  thumbnail: string;
  description: string;
  title: string;
  titleA: string;
  studio: string;
  source: string;
  duration: string;
  genre: string;
  score: string;
  nextEpisode: {
    title: string;
    url: string;
    href: string;
  };
  prevEpisode: {
    title: string;
    url: string;
    href: string;
  };
  detailStream?: Array<{
    streamLink?: Array<{ text: string; link: string }>;
  }>;
  detailDownload?: Array<{
    thumb?: string;
    batchLink?: Array<{
      rz?: string;
      rzLink?: string;
      mega?: string;
      megaLink?: string;
    }>;
    single1080?: Array<{
      episode?: string;
      link?: string;
    }>;
    single720?: Array<{
      episode?: string;
      link?: string;
    }>;
    single480?: Array<{
      episode?: string;
      link?: string;
    }>;
    single360?: Array<{
      episode?: string;
      link?: string;
    }>;
    single240?: Array<{
      episode?: string;
      link?: string;
    }>;
  }>;
}

export interface CardProps {
  image: string;
  title: string;
  id?: string;
  href: string;
}

export interface CardListProps {
  data: AnimeLink[] | null;
  loading: boolean;
}

export interface PaginationLink {
  href: string;
  text: string;
  page: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  links: PaginationLink[];
}

export interface HeadCompsProps {
  title: string;
  link?: string;
}
