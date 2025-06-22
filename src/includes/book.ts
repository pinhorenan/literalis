// File: src/lib/includes/bookIncludes.ts
import type { Prisma } from '@prisma/client';

export const publicBookSelect = {
  isbn:             true,
  title:            true,
  author:           true,
  coverUrl:         true,
  publisher:        true,
  edition:          true,
  pages:            true,
  language:         true,
  publicationDate:  true,
  externalSource:   true,
} as const;

export function bookSelectArgs(): { select: Prisma.BookSelect } {
  return { select: publicBookSelect };
}
