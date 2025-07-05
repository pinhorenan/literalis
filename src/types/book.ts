// src/types/book.ts
export interface MinimalAuthor {
  id: string;
  name: string;
}

export interface MinimalGenre {
  id: string;
  name: string;
}

export interface MinimalBook {
  isbn: string;
  title: string;
  totalPages: number;
  coverUrl: string;
  authors: MinimalAuthor[];
}

export interface Book extends MinimalBook {
  publicationDate: Date;
  language: string;
  publisher: { id: string; name: string };
  genres: MinimalGenre[];
  averageRating?: number;
  ratingsCount?: number;
}

export const bookSelect = {
  isbn: true,
  title: true,
  pages: true,
  language: true,
  coverUrl: true,
  publicationDate: true,
  rating: true,
  publisher: { select: { id: true, name: true } },
  authors: { select: { author: { select: { id: true, name: true } } } },
  genres: { select: { genre: { select: { id: true, name: true } } } },
} as const;
