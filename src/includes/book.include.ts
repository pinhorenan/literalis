// src/includes/book.include.ts
export const bookSelect = {
    isbn: true,
    title: true,
    author: true,
    coverUrl: true,
    publisher: true,
    edition: true,
    pages: true,
    language: true,
    publicationDate: true,
    external: true,
} as const;