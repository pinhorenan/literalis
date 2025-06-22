// src/app/profile/[username]/page.tsx
import { notFound }                     from 'next/navigation';
import { getViewerSession }             from '@/src/services/viewer.service';
import { ProfileService }               from '@/src/services/server/profile.service';
import ProfileShell                     from '@components/client/profile/ProfileShell';

export default async function Profile({ params }: { params: { username: string } }) {
  const session = await getViewerSession();
  const viewerUsername = session?.user?.username ?? null;

  const user = await ProfileService.getUserProfile(params.username);
  if (!user) notFound();

  const posts = await ProfileService.getUserPosts(params.username, viewerUsername);

  return <ProfileShell initialUser={user} initialPosts={posts} />;
}
