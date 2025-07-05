// src/app/[username]/bookshelf/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/components/layout/sidebars/PrimarySidebar';
import { SuggestionsSidebar } from '@/components/layout/sidebars/SuggestionsSidebar';

export default function BookshelfLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-page flex min-h-screen w-full">
        <PrimarySidebar />

        <SidebarInset>
          <div className="mx-auto flex w-full max-w-screen-lg flex-1 flex-col px-4 py-6">
            {children}
          </div>
        </SidebarInset>

        <SuggestionsSidebar />
      </div>
    </SidebarProvider>
  );
}
