// src/app/auth/onboarding/schema.ts
import * as z from 'zod';

export const onboardingSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(32, 'Máximo 32 caracteres')
    .regex(/^[a-z0-9_]+$/i, 'Use apenas letras, números e "_".'),
  name: z.string().trim().min(1).max(60).optional(),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;
