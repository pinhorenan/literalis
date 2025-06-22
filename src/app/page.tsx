// src/app/page.tsx
import { redirect } from 'next/navigation';
import { getViewerSession } from '@/src/services/viewer.service';
import LandingContent from '@components/client/landing/LandingClient';

export default async function Home() {
  const session = await getViewerSession();
  if (session) redirect('/feed');

  return <LandingContent />;
}