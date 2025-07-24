// src/app/feed/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/components/core/PrimarySidebar';
import { FeedSuggestions } from '@/components/core/FeedSuggestions';

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem',
          '--sidebar-width-mobile': '4rem',
        } as React.CSSProperties
      }
    >
      <PrimarySidebar className="hidden md:flex" />

      <SidebarInset>{children}</SidebarInset>

      <FeedSuggestions />
    </SidebarProvider>
  );
}
