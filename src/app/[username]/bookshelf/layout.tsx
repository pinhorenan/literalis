// src/app/[username]/bookshelf/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/components/core/PrimarySidebar';
import { FeedSuggestions } from '@/components/core/FeedSuggestions';

export default function BookshelfLayout({ children }: { children: React.ReactNode }) {
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

      <SidebarInset className="from-background via-muted/20 to-background bg-gradient-to-br">
        {children}
      </SidebarInset>

      <FeedSuggestions />
    </SidebarProvider>
  );
}
