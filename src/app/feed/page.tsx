// src/app/feed/page.tsx
import { redirect } from 'next/navigation';
import { getViewerSession } from '@services/viewer.service';
import FeedClient from '@components/client/feed/FeedClient';
import { getMany } from '@services/server/post.service';

export default async function FeedPage() {
  const viewer = await getViewerSession();

  if (!viewer) {
    // Redireciona de forma explícita para login (ou outra página pública)
    redirect('/signin');
  }

  const posts = await getMany({
    viewerUsername: viewer.user.username,
    onlyFollowing: false,
    take: 20,
  });

  return <FeedClient initialPosts={posts} initialTab="discover" />;
}
