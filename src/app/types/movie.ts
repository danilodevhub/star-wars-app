export interface Movie {
  uid: string;
  title: string;
  releaseDate: string;
  director: string;
  opening_crawl: string;
  characters: Array<{ uid: string; name: string }>;
} 