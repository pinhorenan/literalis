// src/components/layout/sidebars/PrimarySidebar.tsx
'use client';

import { InstagramStyleSidebar } from '@/src/components/sidebar/Sidebar';

export function PrimarySidebar({ className }: { className?: string }) {
  return <InstagramStyleSidebar className={className} />;
}
