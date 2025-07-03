import { userMock1, userMock2, userMock3 } from './user.mocks';
import type { NotificationDTO } from '../../hooks/types/notification.type';

export const notificationsMock: NotificationDTO[] = [
  {
    id: 'notif1',
    type: 'follow',
    actor: userMock2,
    message: 'começou a seguir você',
    link: `/profile/${userMock2.username}`,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h atrás
    isRead: false,
  },
  {
    id: 'notif2',
    type: 'comment',
    actor: userMock3,
    message: 'comentou em seu post',
    link: `/post/123#comments`,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h atrás
    isRead: false,
  },
  {
    id: 'notif3',
    type: 'like',
    actor: userMock1,
    message: 'curtiu seu post',
    link: `/post/123`,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h atrás
    isRead: true,
  },
  {
    id: 'notif4',
    type: 'system',
    actor: {
      username: 'system',
      name: 'Sistema Literalis',
      avatarUrl: '/icons/logo.svg',
    },
    message: 'Bem-vindo à Literalis! Comece seguindo outros leitores.',
    link: `/profile/${userMock2.username}`,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 3h atrás
    isRead: true,
  },
];
