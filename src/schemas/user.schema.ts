import { z } from 'zod';

export const userCreateSchema = z.object({
    username: z.string().min(3),
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(160).optional(),
});
export type UserCreateDTO = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(160).optional(),
});
export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;
