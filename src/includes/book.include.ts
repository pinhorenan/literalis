export const minimalBookSelect = {
  isbn: true,
  title: true,
  coverUrl: true,
  pages: true,
} as const;

export const fullBookSelect = {
  ...minimalBookSelect,
  author: true,
  publisher: true,
  edition: true,
  language: true,
  publicationDate: true,
  external: true,
} as const;
