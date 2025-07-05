/** Seleção mínima para exibir capas, infos rápidas e para o feed */
export const MINIMAL_BOOK_SELECT = {
  isbn: true,
  title: true,
  coverUrl: true,
  pages: true,
  language: true,
  publisher: { select: { id: true, name: true } },
  authors: { select: { author: { select: { id: true, name: true } } } },
} as const;

/** Seleção completa para página de detalhes do livro */
export const FULL_BOOK_SELECT = {
  ...MINIMAL_BOOK_SELECT,
  publicationDate: true,
  rating: true,
  genres: { select: { genre: { select: { id: true, name: true } } } },
} as const;
