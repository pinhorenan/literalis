// src/types/common.ts

/** Enum de status de leitura */
export type ReadingStatus = 'TO_READ' | 'WISHLISTED' | 'READING' | 'PAUSED' | 'READ' | 'ABANDONED';

/** Tipagem genérica para resultados paginados via cursor */
export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}
