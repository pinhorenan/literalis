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
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ModeToggle } from '@/components/layout/buttons/ModeToggle';
import { Logo } from '../../app/landing/landing-decorations';
import { SearchPanel } from './SearchPanel';
import { NotificationPanel } from './NotificationPanel';

export function InstagramStyleSidebar({ className }: { className?: string }) {
  const { data: session } = useSession();
  const [activePanel, setActivePanel] = useState<'search' | 'notifications' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!session || !session.user) return null;

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
        {/* Header */}
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

        {/* Navigation */}
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

        {/* Footer */}
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

      {/* Search Panel */}
      <SearchPanel isExpanded={activePanel === 'search'} onClose={() => setActivePanel(null)} />

      {/* Notification Panel */}
      <NotificationPanel
        isExpanded={activePanel === 'notifications'}
        onClose={() => setActivePanel(null)}
      />
    </div>
  );
}
