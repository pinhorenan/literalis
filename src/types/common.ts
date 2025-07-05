// src/types/common.ts
import { z } from 'zod';

export const ReadingStatusEnum = z.enum([
  'TO_READ',
  'WISHLISTED',
  'READING',
  'PAUSED',
  'READ',
  'ABANDONED',
]);
export type ReadingStatus = z.infer<typeof ReadingStatusEnum>;

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}
