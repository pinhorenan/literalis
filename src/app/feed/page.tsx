// File: src/app/feed/page.tsx
import { getViewer } from '@lib/auth/viewer';
import FeedClient from '@components/client/feed/FeedClient';

export default async function Feed() {
  return <FeedClient initialPosts={initialPosts} />
}