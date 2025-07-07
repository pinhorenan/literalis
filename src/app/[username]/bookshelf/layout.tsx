// src/app/[username]/bookshelf/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/components/layout/sidebars/PrimarySidebar';
import { SuggestionsSidebar } from '@/components/layout/sidebars/SuggestionsSidebar';

export default function BookshelfLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-page flex min-h-screen w-full justify-between">
        <PrimarySidebar />

        <SidebarInset>
          <div className="mx-4 my-4 flex w-full max-w-screen-xl flex-col border">{children}</div>
        </SidebarInset>

        <SuggestionsSidebar />
      </div>
    </SidebarProvider>
  );
}
