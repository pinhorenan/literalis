// src/app/feed/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/components/layout/sidebars/PrimarySidebar';
import { SuggestionsSidebar } from '@/components/layout/sidebars/SuggestionsSidebar';

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div suppressHydrationWarning className="bg-page mx-auto flex min-h-screen justify-between">
        <PrimarySidebar />

        <SidebarInset>{children}</SidebarInset>

        <SuggestionsSidebar />
      </div>
    </SidebarProvider>
  );
}
