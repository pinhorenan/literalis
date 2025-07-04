'use client';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/src/components/sidebars/PrimarySidebar';
import { SuggestionsSidebar } from '@/src/components/sidebars/SuggestionsSidebar';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
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
