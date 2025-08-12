// src/components/core/FeedFilters.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const chips = [
  { id: 'all', label: 'Tudo' },
  { id: 'seguindo', label: 'Seguindo' },
  { id: 'resenhas', label: 'Resenhas' },
  { id: 'citacoes', label: 'Citações' },
  { id: 'progresso', label: 'Progresso' },
  { id: 'listas', label: 'Listas' },
];

export default function FeedFilters({ className }: { className?: string }) {
  const [active, setActive] = useState('all');

  return (
    <nav aria-label="Filtros do feed" className={cn('relative', className)}>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-2">
        {chips.map((c) => {
          const selected = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={cn(
                'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                selected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
