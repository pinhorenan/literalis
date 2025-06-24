// Campos mínimos – MinimalBookDTO :contentReference[oaicite:1]{index=1}
export const minimalBookSelect = {
  isbn: true,
  title: true,
  coverUrl: true,
  pages: true,
} as const;

/** Seleção completa – BookDTO */
export const fullBookSelect = {
  ...minimalBookSelect,
  author: true,
  publisher: true,
  edition: true,
  language: true,
  publicationDate: true,
  external: true,
} as const;
