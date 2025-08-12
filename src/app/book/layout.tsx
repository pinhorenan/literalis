// src/app/book/layout.tsx
import AppLayout from '@/components/layout/AppLayout';

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout maxWidth="md">{children}</AppLayout>;
}
