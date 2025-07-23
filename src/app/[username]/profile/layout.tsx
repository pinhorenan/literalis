  // src/app/[username]/profile/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/src/components/core/PrimarySidebar';
import { FeedSuggestions } from '@/src/components/core/FeedSuggestions';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="bg-page flex min-h-screen w-full">
        <PrimarySidebar />

        <SidebarInset>
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4">
            {children}
          </div>
        </SidebarInset>

        <FeedSuggestions />
      </div>
    </SidebarProvider>
  );
}
