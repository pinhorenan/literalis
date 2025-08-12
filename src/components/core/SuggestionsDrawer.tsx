// src/components/layout/sidebars/SuggestionsDrawer.tsx
'use client';

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Users } from 'lucide-react';
import { SuggestionsPanel } from '../layout/mobile/SuggestionsPanel';

export function SuggestionsDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Sugestões"
          className="bg-primary text-primary-foreground fixed bottom-4 right-4 z-50 rounded-full p-3 shadow xl:hidden"
        >
          <Users className="size-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 p-0">
        <SuggestionsPanel />
      </SheetContent>
    </Sheet>
  );
}
