// src/app/[username]/profile/layout.tsx
import AppLayout from '@/components/layout/AppLayout';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout maxWidth="md">{children}</AppLayout>;
}
