// File: src/components/ui/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes'; 
import { Sun, Moon  } from 'lucide-react';
import { Button } from '@components/ui/Buttons';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';
  return (
    <Button
        variant='icon'
        icon={isDark ? Moon : Sun}
        iconSize={24}
        active={isDark}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
    />
  );
}
