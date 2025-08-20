// src/components/layout/sidebars/PrimarySidebar.tsx
'use client';

import { MainSidebar } from '@/components/Sidebar';

export function PrimarySidebar({ className }: { className?: string }) {
  return <MainSidebar className={className} />;
}
