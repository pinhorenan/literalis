// src/components/layout/MobileHeader.tsx
'use client';

import { Menu, Bell, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/pages/landing/landing-decorations';
import { useSidebar } from '@/components/ui/sidebar';

export function MobileHeader() {
  const { setOpenMobile } = useSidebar();

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpenMobile(true)}
          className="flex items-center gap-2"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>

        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-bold">Literalis</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificações</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
