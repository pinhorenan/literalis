// src/api/books.ts

export interface BookDataResponse {
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

export async function fetchBookData(isbn: string): Promise<BookDataResponse> {
  const res = await fetch(`/api/books/${isbn}`);
  if (!res.ok) throw new Error('Erro ao buscar dados do livro');
  return res.json();
}

export async function fetchAllBooks(): Promise<BookDataResponse[]> {
  const res = await fetch('/api/books');
  if (!res.ok) throw new Error('Erro ao buscar lista de livros');
  return res.json();
}
