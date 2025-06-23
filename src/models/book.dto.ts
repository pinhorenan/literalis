export interface MinimalBookDTO {
  isbn: string;
  title: string;
  coverUrl: string;
  pages: number;
}

export interface BookDTO extends MinimalBookDTO {
  author: string;
  publisher: string;
  edition: number;
  language: string;
  publicationDate: Date;
  external: boolean;
}
