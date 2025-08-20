'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
  LibraryIcon,
  Home,
  User,
  Search,
  Mail,
  Bell,
  Power,
  Plus,
  Menu,
  Compass,
  X,
  Heart,
  MessageCircle,
  UserPlus,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ModeToggle } from '@/components/layout/buttons/ModeToggle';
import { Logo } from '../app/landing/landing-decorations';
import { Input } from '@/components/ui/input';
import type { Notification } from '@/types/notification';

// Utility functions
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'agora';
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

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

// Mock data
const mockSearchResults = [
  {
    id: '1',
    username: 'joao_leitor',
    name: 'João Silva',
    type: 'user' as const,
  },
  {
    id: '2',
    username: 'maria_books',
    name: 'Maria dos Livros',
    type: 'user' as const,
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    type: 'book' as const,
  },
  {
    id: '4',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    type: 'book' as const,
  },
];

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
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

// Internal components
function SearchPanel({ isExpanded, onClose }: { isExpanded: boolean; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState(['joao_leitor', 'maria_books', '1984', 'Dom Casmurro']);

  const filteredResults = searchQuery
    ? mockSearchResults.filter(
        (item) =>
          (item.type === 'user' &&
            (item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.name?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
          (item.type === 'book' &&
            (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.author.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
    : [];

  return (
    <div
      className={cn(
        'bg-background border-border/50 absolute left-full top-0 z-50 h-full w-96 border-r transition-transform duration-300',
        isExpanded ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-full flex-col">
        <div className="border-border/50 flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Pesquisa</h2>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="border-border/50 border-b p-4">
          <div className="relative">
            <Search
              className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
            />
            <Input
              placeholder="Pesquisar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted/50 border-none pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchQuery ? (
            <div className="p-4">
              {filteredResults.length > 0 ? (
                <div className="space-y-3">
                  {filteredResults.map((item) => (
                    <div
                      key={item.id}
                      className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                    >
                      {item.type === 'user' ? (
                        <>
                          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                            <span className="text-sm font-medium">
                              {item.name?.[0] || item.username[0]}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.username}</p>
                            <p className="text-muted-foreground text-xs">{item.name}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded">
                            <span className="text-xs">📚</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-muted-foreground text-xs">{item.author}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <Search size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Nenhum resultado encontrado</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-muted-foreground mb-3 text-sm font-medium">Recentes</h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search size={16} className="text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </div>
                    <button className="hover:bg-muted rounded-full p-1 transition-colors">
                      <X size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full p-2 text-left text-sm text-blue-600 hover:text-blue-700">
                Limpar tudo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationPanel({ isExpanded, onClose }: { isExpanded: boolean; onClose: () => void }) {
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
        'bg-background border-border/50 absolute left-full top-0 z-50 h-full w-96 border-r transition-transform duration-300',
        isExpanded ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-full flex-col">
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

        {unreadCount > 0 && (
          <div className="border-border/50 border-b p-4">
            <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-700">
              Marcar todas como lidas
            </button>
          </div>
        )}

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

// Main Sidebar component
export function MainSidebar({ className }: { className?: string }) {
  const { data: session } = useSession();
  const [activePanel, setActivePanel] = useState<'search' | 'notifications' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!session?.user) return null;

  const viewer = session.user;
  const menuItems = [
    {
      id: 'home',
      href: '/feed',
      icon: Home,
      label: 'Início',
      isActive: false,
    },
    {
      id: 'search',
      href: '#',
      icon: Search,
      label: 'Pesquisa',
      onClick: () => setActivePanel(activePanel === 'search' ? null : 'search'),
      isActive: activePanel === 'search',
    },
    {
      id: 'explore',
      href: '/explore',
      icon: Compass,
      label: 'Explorar',
      isActive: false,
    },
    {
      id: 'bookshelf',
      href: `/${viewer.username}/bookshelf`,
      icon: LibraryIcon,
      label: 'Estante',
      isActive: false,
    },
    {
      id: 'messages',
      href: '/messages',
      icon: Mail,
      label: 'Mensagens',
      isActive: false,
    },
    {
      id: 'notifications',
      href: '#',
      icon: Bell,
      label: 'Notificações',
      badge: 3,
      onClick: () => setActivePanel(activePanel === 'notifications' ? null : 'notifications'),
      isActive: activePanel === 'notifications',
    },
    {
      id: 'create',
      href: '/create',
      icon: Plus,
      label: 'Criar',
      isActive: false,
    },
    {
      id: 'profile',
      href: `/${viewer.username}/profile`,
      icon: User,
      label: 'Perfil',
      isActive: false,
    },
  ];

  return (
    <div className="relative">
      <Sidebar
        side="left"
        variant="sidebar"
        collapsible="none"
        className={cn(
          'border-border/50 h-full border-r transition-all duration-300',
          isCollapsed ? 'w-16' : 'w-64',
          className,
        )}
      >
        <SidebarHeader className="border-border/50 flex flex-row items-center gap-3 border-b px-6 py-4">
          {!isCollapsed && (
            <>
              <div className="relative">
                <Logo className="size-8 drop-shadow-sm" />
                <div className="bg-primary absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 animate-pulse rounded-full" />
              </div>
              <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                Literalis
              </h1>
            </>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-muted ml-auto rounded-lg p-2 transition-colors"
          >
            <Menu size={20} />
          </button>
        </SidebarHeader>

        <SidebarContent className="flex-1 py-6">
          <SidebarMenu className="space-y-2 px-3">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  className={cn(
                    'hover:bg-muted/60 group h-12 rounded-xl transition-all duration-200',
                    item.isActive && 'bg-muted/80 text-foreground font-medium',
                    isCollapsed && 'px-3',
                  )}
                  tooltip={isCollapsed ? item.label : undefined}
                >
                  {item.href === '#' ? (
                    <button onClick={item.onClick} className="flex w-full items-center gap-4 p-2">
                      <div
                        className={cn(
                          'relative rounded-lg p-2 transition-colors',
                          item.isActive ? 'bg-primary/10 text-primary' : 'group-hover:bg-primary/5',
                        )}
                      >
                        <item.icon
                          size={24}
                          className="transition-transform group-hover:scale-110"
                        />
                        {item.badge && !isCollapsed && (
                          <div className="bg-destructive text-destructive-foreground absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                            {item.badge}
                          </div>
                        )}
                      </div>
                      {!isCollapsed && (
                        <span className="text-[15px] font-medium">{item.label}</span>
                      )}
                    </button>
                  ) : (
                    <Link href={item.href} className="flex w-full items-center gap-4 p-2">
                      <div
                        className={cn(
                          'relative rounded-lg p-2 transition-colors',
                          item.isActive ? 'bg-primary/10 text-primary' : 'group-hover:bg-primary/5',
                        )}
                      >
                        <item.icon
                          size={24}
                          className="transition-transform group-hover:scale-110"
                        />
                        {item.badge && !isCollapsed && (
                          <div className="bg-destructive text-destructive-foreground absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                            {item.badge}
                          </div>
                        )}
                      </div>
                      {!isCollapsed && (
                        <span className="text-[15px] font-medium">{item.label}</span>
                      )}
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-border/50 border-t px-3 py-4">
          <SidebarMenu className="space-y-2">
            {!isCollapsed && (
              <SidebarMenuItem>
                <div className="hover:bg-muted/60 rounded-xl transition-colors">
                  <ModeToggle className="w-full p-3" verbose />
                </div>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton
                className="hover:bg-destructive/10 hover:text-destructive group h-12 cursor-pointer rounded-xl transition-colors"
                onClick={() => signOut()}
                tooltip={isCollapsed ? 'Sair' : undefined}
              >
                <div className="bg-destructive/10 text-destructive rounded-lg p-2">
                  <Power className="h-6 w-6" />
                </div>
                {!isCollapsed && <span className="text-[15px] font-medium">Sair</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SearchPanel isExpanded={activePanel === 'search'} onClose={() => setActivePanel(null)} />
      <NotificationPanel
        isExpanded={activePanel === 'notifications'}
        onClose={() => setActivePanel(null)}
      />
    </div>
  );
}
