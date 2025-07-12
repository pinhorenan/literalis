// src/components/layout/sidebars/SuggestionsDrawer.tsx
'use client';

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Users } from 'lucide-react';

export function SuggestionsDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          aria-label="Sugestões"
          className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow xl:hidden"
        >
          <Users className="size-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 p-0">
        <SuggestionsPanel />
    </Sheet>
  );
}