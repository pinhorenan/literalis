// src/app/feed/layout.tsx
import AppLayout from '@/components/layout/AppLayout';

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout customContent={true}>{children}</AppLayout>;
}
