// File: src/app/feed/layout.tsx

import { ReactNode }    from 'react';
import PrimarySidebar   from '@/src/components/client/ui/PrimarySidebar';
import FeedSidebar      from '@/src/components/server/ui/FeedSidebar';
import MobileBottomNav  from '@/src/components/client/ui/MobileBottomNav';
import MobileHeader     from '@/src/components/client/ui/MobileHeader';

export default function FeedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-screen-xl mx-auto px-4 md:px-8">
      <MobileHeader /> 
      <aside className="hidden lg:block w-[240px]">
        <PrimarySidebar />
      </aside>

      <main className="flex-1 py-8 lg:py-0 min-w-0 my-6">
        {children}
      </main>
      
      <aside className="hidden lg:block w-[240px]">
        <FeedSidebar />
      </aside>

      <MobileBottomNav />
    </div>
  );
}
