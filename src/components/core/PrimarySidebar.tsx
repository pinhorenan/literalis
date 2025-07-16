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
    className={cn('h-full', className)}
    >
      {/* topo */}
      <SidebarHeader className="flex flex-row items-center gap-4 p-4">
        <Logo className="size-14" />
        <h1 className="text-3xl font-semibold">Literalis</h1>
      </SidebarHeader>

      {/* nav */}
      <SidebarContent>
        <SidebarMenu className="flex h-auto flex-col gap-4 px-4">
          {[
            { href: '/feed', icon: Home, label: 'Início' },
            { href: `/${viewer.username}/profile`, icon: User, label: 'Perfil' },
            { href: `/${viewer.username}/bookshelf`, icon: LibraryIcon, label: 'Estante' },
            { href: '/search', icon: Search, label: 'Buscar' },
            { href: '/', icon: Mail, label: 'Mensagens' },
            { href: '/', icon: Bell, label: 'Notificações', badge: 3 },
          ].map((item) => (
            <SidebarMenuItem className="min-h-auto" key={item.label}>
              <SidebarMenuButton className="min-h-12 py-2 rounded" tooltip={item.label}>
                <Link href={item.href} className="rounded flex items-center gap-2 p-2 hover:bg-surface-alt">
                  <item.icon size={36} />
                  <h2 className="text-lg font-semibold">{item.label}</h2>
                  {item.badge && (
                    <div
                      data-sidebar="menu-badge"
                      className="text-primary bg-destructive ml-2 mt-1 flex h-7 w-7 items-center justify-center rounded-full p-1 font-semibold"
                    >
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
      <SidebarFooter>
        <SidebarMenu className="flex flex-col gap-4 px-2 py-6">
          <SidebarMenuItem>
            <ModeToggle />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="cursor-pointer" onClick={() => signOut()} tooltip="Sair">
              <Power />
              <h2 className="texg-lg">Sair</h2>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
