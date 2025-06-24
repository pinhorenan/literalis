// src/components/client/profile/PostsList.tsx
'use client'; 

import PostCard from '@/src/components/client/post/Post';
import type { PostDTO } from '@/src/models/post.model';

interface Props {
  posts: PostDTO[];
  emptyMessage?: string;
}

export default function PostsList({ posts, emptyMessage = 'Nenhum post ainda.' }: Props) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-[var(--text-secondary)] mt-8">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} isProfile />
      ))}
    </div>
  );
}
