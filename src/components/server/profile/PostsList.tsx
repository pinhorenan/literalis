// File: src/components/server/profile/PostsList.tsx
import PostCard from '@components/client/post/PostCard';
import type { PostDTO } from '@dto/post.dto';

interface Props {
  posts: PostDTO[];
}

export default function PostsList({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-[var(--text-secondary)] mt-8">
        Nenhum post ainda.
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
