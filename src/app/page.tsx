import LandingContent from '@components/client/landing/LandingClient';
import { getViewerSession } from '@services/viewer.service';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getViewerSession();
  if (session) redirect('/feed');

  return <LandingContent />;
}
