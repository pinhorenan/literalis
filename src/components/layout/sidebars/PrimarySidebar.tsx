// src/components/layout/sidebars/PrimarySidebar.tsx
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { BookIcon, LibraryIcon, Home, User, Search, Mail, Bell, Power } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ModeToggle } from '@/components/layout/buttons/ModeToggle';

export function PrimarySidebar() {
  const { data: session } = useSession();
  if (!session || !session.user) {
    return null; // or a loading state
  }
  const viewer = session.user!;
  const username = viewer.username!;

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      {/* topo */}
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          variant="outline"
          size="lg"
          className="gap-3 text-lg font-semibold"
          isActive
        >
          <Link href="/">
            <BookIcon className="size-5" />
            <span>Literalis</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      {/* nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                { href: '/feed', icon: Home, label: 'Início' },
                { href: `/${viewer.username}/profile`, icon: User, label: 'Perfil' },
                {
                  href: `/${viewer.username}/bookshelf`,
                  icon: LibraryIcon,
                  label: 'Estante',
                },
                { href: '/search', icon: Search, label: 'Buscar' },
                { href: '/', icon: Mail, label: 'Mensagens' },
                { href: '/', icon: Bell, label: 'Notificações', badge: 3 },
              ].map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && <div data-sidebar="menu-badge">{item.badge}</div>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
      </SidebarContent>

      {/* rodape */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Tema Claro/Escuro">
              <ModeToggle />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => console.log('sign-out')} tooltip="Sair">
              <Power />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
