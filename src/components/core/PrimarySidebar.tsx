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
      className={cn('h-full border-r border-border/50', className)}
    >
      {/* topo */}
      <SidebarHeader className="flex flex-row items-center gap-2 p-4 border-b">
        <div className="relative pl-6">
          <Logo className="size-10 drop-shadow-sm" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text">
          Literalis
        </h1>
      </SidebarHeader>

      {/* nav */}
      <SidebarContent>
        <SidebarMenu className="flex h-auto flex-col gap-2 p-4">
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
                className="min-h-14 py-2 rounded-lg hover:bg-muted/60 transition-all duration-200 group" 
                tooltip={item.label}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link 
                  href={item.href} 
                  className="rounded-lg flex items-center gap-3 p-2 w-full hover:bg-primary/5 hover:scale-105 hover:text-lg transition-all ease-in-out duration-400"
                >
                  <div className={`p-1.5 rounded-lg transition-transform`}>
                    <item.icon size={28} className="text-current" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground transition-colors">
                    {item.label}
                  </h2>
                  {item.badge && (
                    <div className="bg-destructive text-destructive-foreground ml-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold animate-pulse">
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
      <SidebarFooter className="border-t border-border/50">
        <SidebarMenu className="flex flex-col gap-2 px-2 py-6">
          <SidebarMenuItem>
            <div className="hover:bg-muted/60 rounded-lg transition-all duration-200 group">
              <ModeToggle className="w-full p-2" verbose />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="cursor-pointer py-6 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-lg group" 
              onClick={() => signOut()} 
              tooltip="Sair"
            >
              <div className="p-1.5 rounded-lg bg-destructive/10 text-destructive transition-transform group-hover:scale-110">
                <Power className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold transition-colors">Sair</h2>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
