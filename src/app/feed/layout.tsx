// src/app/feed/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/components/core/PrimarySidebar';
import { FeedSuggestions } from '@/components/core/FeedSuggestions';
import { MobileBottomNavigation } from '@/components/layout/MobileBottomNavigation';
import { MobileHeader } from '@/components/layout/MobileHeader';

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

      <SidebarInset className="bg-background min-h-dvh">
        <MobileHeader />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <MobileBottomNavigation />
      </SidebarInset>

      <FeedSuggestions />
    </SidebarProvider>
  );
}
