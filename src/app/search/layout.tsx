// src/app/search/layout.tsx
import AppLayout from '@/components/layout/AppLayout';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout maxWidth="md">{children}</AppLayout>;
}
