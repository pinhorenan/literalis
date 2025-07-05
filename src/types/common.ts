// src/types/common.ts
import { z } from 'zod';

/** Enum de status de leitura — mantém 1-para-1 com o enum do schema Prisma */
export const ReadingStatusEnum = z.enum([
  'TO_READ',
  'WISHLISTED',
  'READING',
  'PAUSED',
  'READ',
  'ABANDONED',
]);
export type ReadingStatus = z.infer<typeof ReadingStatusEnum>;

/** Resultado paginado por cursor */
export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}
