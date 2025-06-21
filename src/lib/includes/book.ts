// File: src/lib/includes/bookIncludes.ts
import type { db } from '@prisma/client';

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

export function bookSelectArgs(): { select: db.bookSelect } {
  return { select: publicBookSelect };
}
