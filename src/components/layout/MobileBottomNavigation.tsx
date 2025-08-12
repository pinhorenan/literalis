// src/components/layout/MobileBottomNavigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, User, LibraryIcon, Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SuggestionsPanel } from './mobile/SuggestionsPanel';

export function MobileBottomNavigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!session?.user) return null;

  const viewer = session.user;

  const navigationItems = [
    {
      href: '/feed',
      icon: Home,
      label: 'Início',
      active: pathname === '/feed',
    },
    {
      href: '/search',
      icon: Search,
      label: 'Buscar',
      active: pathname === '/search',
    },
    {
      href: `/${viewer.username}/bookshelf`,
      icon: LibraryIcon,
      label: 'Estante',
      active: pathname.includes('/bookshelf'),
    },
    {
      href: `/${viewer.username}/profile`,
      icon: User,
      label: 'Perfil',
      active: pathname.includes('/profile'),
    },
  ];

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="border-border/20 bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-xs transition-colors',
                item.active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className={cn('h-5 w-5', item.active && 'text-primary')} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Suggestions Sheet Trigger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-xs"
              >
                <Users className="h-5 w-5" />
                <span className="text-[10px] font-medium">Sugestões</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader className="p-4">
                <SheetTitle>Perfis Recomendados</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto p-4">
                <SuggestionsPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
}
