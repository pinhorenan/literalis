// src/app/[username]/bookshelf/layout.tsx
import AppLayout from '@/components/layout/AppLayout';

export default function BookshelfLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout maxWidth="lg">{children}</AppLayout>;
}
