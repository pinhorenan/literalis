'use client';

import { useState } from 'react';
import { Bell, X, Heart, MessageCircle, UserPlus, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/notification';

interface NotificationPanelProps {
  isExpanded: boolean;
  onClose: () => void;
}

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'LIKE',
    actor: {
      id: '1',
      username: 'joao_leitor',
      name: 'João Silva',
      avatarUrl: '/api/placeholder/40/40',
    },
    resourceId: 'post-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: '2',
    type: 'FOLLOW',
    actor: {
      id: '2',
      username: 'maria_books',
      name: 'Maria dos Livros',
      avatarUrl: '/api/placeholder/40/40',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
  {
    id: '3',
    type: 'COMMENT',
    actor: {
      id: '3',
      username: 'pedro_escritor',
      name: 'Pedro Escritor',
      avatarUrl: '/api/placeholder/40/40',
    },
    resourceId: 'post-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '4',
    type: 'REVIEW',
    actor: {
      id: '4',
      username: 'ana_leitora',
      name: 'Ana Leitora',
      avatarUrl: '/api/placeholder/40/40',
    },
    resourceId: 'book-1984',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'LIKE':
      return <Heart size={16} className="text-red-500" />;
    case 'COMMENT':
      return <MessageCircle size={16} className="text-blue-500" />;
    case 'FOLLOW':
      return <UserPlus size={16} className="text-green-500" />;
    case 'REVIEW':
      return <BookOpen size={16} className="text-purple-500" />;
    default:
      return <Bell size={16} className="text-muted-foreground" />;
  }
};

const getNotificationText = (notification: Notification) => {
  switch (notification.type) {
    case 'LIKE':
      return 'curtiu sua publicação';
    case 'COMMENT':
      return 'comentou em sua publicação';
    case 'FOLLOW':
      return 'começou a seguir você';
    case 'REVIEW':
      return 'avaliou um livro em sua estante';
    default:
      return 'interagiu com você';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return 'agora';
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
};

export function NotificationPanel({ isExpanded, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.readAt) : notifications;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        readAt: notification.readAt || new Date(),
      })),
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, readAt: notification.readAt || new Date() }
          : notification,
      ),
    );
  };

  return (
    <div
      className={cn(
        'bg-background border-border/50 absolute left-full top-0 z-50 h-full w-96 border-r transition-transform duration-300 ease-in-out',
        isExpanded ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-border/50 flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Notificações</h2>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="border-border/50 border-b p-4">
          <div className="bg-muted flex rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                filter === 'all'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                filter === 'unread'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Não lidas ({unreadCount})
            </button>
          </div>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="border-border/50 border-b p-4">
            <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-700">
              Marcar todas como lidas
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            <div className="divide-border/50 divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    'hover:bg-muted/50 cursor-pointer p-4 transition-colors',
                    !notification.readAt && 'bg-blue-50/50 dark:bg-blue-950/20',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                      <span className="text-sm font-medium">
                        {notification.actor.name?.[0] || notification.actor.username[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{notification.actor.username}</span>
                        {getNotificationIcon(notification.type)}
                        {!notification.readAt && (
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {getNotificationText(notification)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
              <Bell size={48} className="mb-2 opacity-50" />
              <p className="text-sm">
                {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
