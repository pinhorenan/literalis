// src/app/feed/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/components/layout/sidebars/PrimarySidebar';
import { SuggestionsSidebar } from '@/components/layout/sidebars/SuggestionsSidebar';

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-page grid min-h-screen grid-cols-[auto_minmax(0,1fr)_auto]">
        <aside aria-label="Primary navigation">
          <PrimarySidebar />
        </aside>

        <SidebarInset>
          <main className="mx-auto w-full max-w-screen-lg overflow-y-auto px-4 py-6">
            {children}
          </main>
        </SidebarInset>

        <aside aria-label="People you may like">
          <SuggestionsSidebar />
        </aside>
      </div>
    </SidebarProvider>
  );
}
