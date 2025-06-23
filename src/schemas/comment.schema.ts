import { z } from 'zod';

export const commentCreateSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(1000),
});
export type CommentCreateDTO = z.infer<typeof commentCreateSchema>;

export const commentUpdateSchema = z.object({
  content: z.string().min(1).max(1000),
});
export type CommentUpdateDTO = z.infer<typeof commentUpdateSchema>;