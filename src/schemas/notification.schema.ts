import { z } from 'zod';

export const notificationMarkReadSchema = z.object({
  id: z.string().min(1),
});
export type NotificationMarkReadDTO = z.infer<typeof notificationMarkReadSchema>;
