// src/app/feed/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Hydrate } from '@/providers/Hydrate';
import { fetchFeedPosts } from '@/api/posts';
import { fetchAllBooks } from '@/api/books';
import FeedClient from './client';

// todo: fazer prefetch de feed e books: dá pra fazer prefetch da página 1 dos dois e passar o cache desidratado pro cliente. da pra ver mais disso no "Advanced SRR Guide" do TanStack: [https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr?utm_source=chatgpt.com]
export default async function FeedPage() {
  const session = await auth();

  if (!session) {
    redirect('/signin?redirectTo=/feed');
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['posts', 'feed'],
    queryFn: () => fetchFeedPosts(undefined),
    initialPageParam: undefined,
  });

  await queryClient.prefetchQuery({
    queryKey: ['books', 'all'],
    queryFn: () => fetchAllBooks(),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <FeedClient session={session} />
    </Hydrate>
  );
}
