// src/hooks/global/useOptionsMenu.ts
import { useCallback, useState, useRef } from 'react';
import useClickOutside from '@/src/hooks/global/useClickOutside';

export default function useOptionsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen(prev => !prev), []);
  const close = useCallback(() => setOpen(false), []);

  useClickOutside(ref, close);

  return { open, toggle, close, ref };
}
