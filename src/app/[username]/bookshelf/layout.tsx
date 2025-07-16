// src/app/[username]/bookshelf/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/src/components/core/PrimarySidebar';
import { FeedSuggestions } from '@/src/components/core/FeedSuggestions';

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
        <PrimarySidebar className="hidden md:flex"/>

        <SidebarInset>{children}</SidebarInset>

        <FeedSuggestions />
    </SidebarProvider>
  );
}
