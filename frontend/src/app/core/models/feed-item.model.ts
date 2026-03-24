export type ImageCategory = 'space' | 'nature' | 'architecture' | 'art';
export type MusicType = 'lofi' | 'alpha' | 'ambient';
export type FeedItemType = 'image' | 'music' | 'quote';
export type QuoteCategory = 'focus' | 'creativity' | 'motivation';

export interface InspirationQuote {
  id: string;
  text: string;
  author: string;
  category: QuoteCategory;
}

export interface CosmosImage {
  id: string;
  url: string;
  title: string;
  category: ImageCategory;
  height?: number;
}

export interface MusicTrack {
  id: string;
  name: string;
  embedUrl: string;
  type: MusicType;
  description: string;
}

export interface FeedItem {
  id: string;
  type: FeedItemType;
  data: CosmosImage | MusicTrack | InspirationQuote;
}

export interface SearchQuery {
  term: string;
  filter: 'all' | 'image' | 'music';
}

export interface SearchResult {
  id: string;
  type: 'image' | 'music';
  title: string;
  description?: string;
  category: string;
  url: string;
  relevance?: number;
}
