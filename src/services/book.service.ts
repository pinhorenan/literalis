// src/services/book.service.ts
import { prisma } from '@/lib/prisma';

export interface BookData {
  isbn: string;
  title: string;
  pages: number;
  language: string;
  publisher: {
    id: string;
    name: string;
  };
  authors: {
    id: string;
    name: string;
  }[];
  coverUrl: string;
  genres: {
    id: string;
    name: string;
  }[];
  publicationDate: Date;
  rating: number | null;
}

export async function getBookByIsbn(isbn: string): Promise<BookData | null> {
  const book = await prisma.book.findUnique({
    where: { isbn },
    select: {
      isbn: true,
      title: true,
      pages: true,
      language: true,
      publisher: {
        select: {
          id: true,
          name: true,
        },
      },
      authors: {
        select: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      coverUrl: true,
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      publicationDate: true,
      rating: true,
    },
  });

  if (!book) return null;

  const data: BookData = {
    isbn: book.isbn,
    title: book.title,
    pages: book.pages,
    language: book.language,
    publisher: {
      id: book.publisher.id,
      name: book.publisher.name,
    },
    authors: book.authors.map((a) => ({
      id: a.author.id,
      name: a.author.name,
    })),
    coverUrl: book.coverUrl,
    genres: book.genres.map((g) => ({
      id: g.genre.id,
      name: g.genre.name,
    })),
    publicationDate: book.publicationDate,
    rating: book.rating,
  };

  return data;
}

export async function getBooksByName(name: string): Promise<BookData[] | null> {
  const books = await prisma.book.findMany({
    where: { title: { contains: name, mode: 'insensitive' } },
    select: {
      isbn: true,
      title: true,
      pages: true,
      language: true,
      publisher: {
        select: {
          id: true,
          name: true,
        },
      },
      authors: {
        select: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      coverUrl: true,
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      publicationDate: true,
      rating: true,
    },
  });

  if (books.length === 0) return null;

  const data: BookData[] = books.map((book) => ({
    isbn: book.isbn,
    title: book.title,
    pages: book.pages,
    language: book.language,
    publisher: {
      id: book.publisher.id,
      name: book.publisher.name,
    },
    authors: book.authors.map((a) => ({
      id: a.author.id,
      name: a.author.name,
    })),
    coverUrl: book.coverUrl,
    genres: book.genres.map((g) => ({
      id: g.genre.id,
      name: g.genre.name,
    })),
    publicationDate: book.publicationDate,
    rating: book.rating,
  }));

  return data;
}
