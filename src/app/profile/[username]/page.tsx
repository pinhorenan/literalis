// src/app/profile/[username]/page.tsx
import { notFound } from 'next/navigation';
import { getViewer } from '@lib/auth/viewer';
import { UserService } from '@services/server/user.service';
import ProfileShell from '@components/client/profile/ProfileShell';

export default async function Profile({ params }: { params: { username: string } }) {
  const viewer = await getViewer();
  const viewerUsername = viewer?.username ?? null;

  const user = await UserService.getByUsername(viewerUsername, params.username, );
  if (!user) notFound();

  const posts = []; // TODO: Temporariamente vazio ou com loading em ProfileShell

  return <ProfileShell initialUser={user} initialPosts={posts} />;
}
