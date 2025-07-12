// src/app/feed/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/components/layout/sidebars/PrimarySidebar';
import { SuggestionsSidebar } from '@/components/layout/sidebars/SuggestionsSidebar';
import { SuggestionsDrawer } from '@/components/layout/sidebars/SuggestionsDrawer';

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '15rem',
          '--sidebar-width-mobile': '4rem',
        } as React.CSSProperties
      }
    >
      <div suppressHydrationWarning className="grid min-h-screen grid-cols-1 md:grid-cols-[var--sidebar-width)_1fr] xl:grid-cols-[var(--sidebar-width)_1fr_20rem]">
        <PrimarySidebar className="hidden md:flex"/>

        <SidebarInset>{children}</SidebarInset>

        <SuggestionsSidebar />
      </div>
    </SidebarProvider>
  );
}
