import type { NotificationType } from '@prisma/client';
import type { MinimalUserDTO } from './user.dto';

export interface NotificationDTO {
  id: string;
  notifType: NotificationType;
  createdAt: Date;
  readAt?: Date;
  actor: MinimalUserDTO;
  postId?: string;
  commentId?: string;
}
