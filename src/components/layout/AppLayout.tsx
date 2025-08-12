// src/components/layout/AppLayout.tsx
'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PrimarySidebar } from '@/components/core/PrimarySidebar';
import { FeedSuggestions } from '@/components/core/FeedSuggestions';
import { MobileBottomNavigation } from '@/components/layout/MobileBottomNavigation';
import { MobileHeader } from '@/components/layout/MobileHeader';

interface AppLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showSuggestions?: boolean;
  customContent?: boolean; // Para páginas como feed que têm layout customizado
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  full: 'max-w-full',
};

export function AppLayout({
  children,
  maxWidth = 'lg',
  showSuggestions = true,
  customContent = false,
}: AppLayoutProps) {
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

      <SidebarInset className="bg-background min-h-dvh">
        <MobileHeader />
        <main className="flex-1 pb-16 md:pb-0">
          {customContent ? (
            children
          ) : (
            <div className={`app-container flex ${maxWidthClasses[maxWidth]} flex-1 flex-col py-4`}>
              {children}
            </div>
          )}
        </main>
        <MobileBottomNavigation />
      </SidebarInset>

      {showSuggestions && <FeedSuggestions />}
    </SidebarProvider>
  );
}

export default AppLayout;
