import { z } from 'zod';

export const bookCreateSchema = z.object({
  isbn: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  publisher: z.string().optional(),
  edition: z.number().int().positive().optional(),
  pages: z.number().int().positive(),
  language: z.string().optional(),
  publicationDate: z.preprocess(arg => arg instanceof Date ? arg : new Date(arg as string), z.date()).optional(),
  coverUrl: z.string().url().optional(),
  external: z.boolean().optional(),
});
export type BookCreateDTO = z.infer<typeof bookCreateSchema>;

export const bookUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  publisher: z.string().optional(),
  edition: z.number().int().positive().optional(),
  pages: z.number().int().positive().optional(),
  language: z.string().optional(),
  publicationDate: z.preprocess(arg => arg instanceof Date ? arg : new Date(arg as string), z.date()).optional(),
  coverUrl: z.string().url().optional(),
  external: z.boolean().optional(),
});
export type BookUpdateDTO = z.infer<typeof bookUpdateSchema>;