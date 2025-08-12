// src/components/layout/sidebars/PrimarySidebar.tsx
'use client';

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
import { LibraryIcon, Home, User, Search, Mail, Bell, Power } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ModeToggle } from '@/components/layout/buttons/ModeToggle';
import { Logo } from '../pages/landing/landing-decorations';

export function PrimarySidebar({ className }: { className?: string }) {
  const { data: session } = useSession();
  if (!session || !session.user) return null;

  const viewer = session.user;

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
      className={cn('border-border/50 h-full border-r', className)}
    >
      {/* topo */}
      <SidebarHeader className="flex flex-row items-center gap-2 border-b p-4">
        <div className="relative pl-6">
          <Logo className="size-10 drop-shadow-sm" />
          <div className="bg-primary absolute -bottom-1 -right-1 h-3 w-3 animate-pulse rounded-full" />
        </div>
        <h1 className="bg-clip-text text-xl font-bold">Literalis</h1>
      </SidebarHeader>

      {/* nav */}
      <SidebarContent>
        <SidebarMenu className="flex h-auto flex-col gap-1.5 p-3">
          {[
            { href: '/feed', icon: Home, label: 'Início' },
            { href: `/${viewer.username}/profile`, icon: User, label: 'Perfil' },
            { href: `/${viewer.username}/bookshelf`, icon: LibraryIcon, label: 'Estante' },
            { href: '/search', icon: Search, label: 'Buscar' },
            { href: '/', icon: Mail, label: 'Mensagens' },
            { href: '/', icon: Bell, label: 'Notificações', badge: 3 },
          ].map((item, index) => (
            <SidebarMenuItem className="min-h-auto" key={item.label}>
              <SidebarMenuButton
                className="hover:bg-muted/60 group min-h-12 rounded-md py-2 transition-colors"
                tooltip={item.label}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link
                  href={item.href}
                  className="hover:bg-primary/5 flex w-full items-center gap-3 rounded-md p-2 transition-colors"
                >
                  <div className={`rounded-md p-1.5`}>
                    <item.icon size={22} className="text-current" />
                  </div>
                  <h2 className="text-foreground text-sm font-medium">{item.label}</h2>
                  {item.badge && (
                    <div className="bg-destructive text-destructive-foreground ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                      {item.badge}
                    </div>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* rodape */}
      <SidebarFooter className="border-border/50 border-t">
        <SidebarMenu className="flex flex-col gap-2 px-2 py-4">
          <SidebarMenuItem>
            <div className="hover:bg-muted/60 group rounded-md transition-colors">
              <ModeToggle className="w-full p-2" verbose />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:bg-destructive/10 hover:text-destructive group cursor-pointer rounded-md py-4 transition-colors"
              onClick={() => signOut()}
              tooltip="Sair"
            >
              <div className="bg-destructive/10 text-destructive rounded-md p-1.5">
                <Power className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold">Sair</h2>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
