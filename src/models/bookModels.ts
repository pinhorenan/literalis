export interface BookDTO {
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  edition: number;
  pages: number;
  language: string;
  publicationDate: Date;
  coverUrl: string;
  external: boolean;
}

export interface MinimalBookDTO {
  title: string;
  authors: string[];
  pages: number;
  coverUrl: string;
}
