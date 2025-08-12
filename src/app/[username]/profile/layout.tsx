// src/app/[username]/profile/layout.tsx
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/src/components/core/PrimarySidebar';
import { FeedSuggestions } from '@/src/components/core/FeedSuggestions';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
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

      <SidebarInset>
        <div className="app-container flex max-w-4xl flex-1 flex-col py-4">{children}</div>
      </SidebarInset>

      <FeedSuggestions />
    </SidebarProvider>
  );
}
