// File: src/app/page.tsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth/auth';
import LandingContent from '@components/client/landing/LandingClient';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/feed');

  return <LandingContent />;
}