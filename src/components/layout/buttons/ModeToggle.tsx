'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

export function ModeToggle({
  verbose = false,
  className = '',
}: {
  verbose?: boolean;
  className?: string;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`hover:bg-card inline-flex cursor-pointer items-center gap-2 rounded-lg p-2 ${className}`}
          style={{ width: 'fit-content' }}
        >
          <Sun
            size={30}
            className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Moon
            size={30}
            className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          {verbose ? (
            <h2 className="text-lg font-semibold">
              {theme === 'dark'
                ? 'Tema escuro'
                : theme === 'light'
                  ? 'Tema claro'
                  : 'Tema do sistema'}
            </h2>
          ) : null}
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuItem onClick={() => setTheme('light')}>Claro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Escuro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>Sistema</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
