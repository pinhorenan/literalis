// src/components/client/post/PostCard.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import PostHeader from './partials/PostHeader';
import PostBody from './partials/PostBody';
import PostActions from './partials/PostActions';
import PostComments from './partials/PostComments';
import EditPostModal from './EditPostModal';
import DeletePostModal from './DeletePostModal';

import usePostController from '@hooks/post/usePostController';
import { useFollowContext } from '@/src/contexts/followContext';

import type { PostDTO } from '@models/post.dto';

export default function PostCard({ post, isProfile = false }: { post: PostDTO; isProfile?: boolean }) {
  const router = useRouter();
  const { isAuthor, isAuthenticated, like, comments, requestSignIn, deletePost } = usePostController(post);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { getFollow } = useFollowContext();
  const isFollowingAuthor = post.isFollowingAuthor ?? getFollow(post.author.username) ?? false;

  const enrichedPost: PostDTO = {
    ...post,
    isFollowingAuthor,
  };

  return (
    <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-sm overflow-hidden">
      <PostHeader
        author={enrichedPost.author}
        createdAt={enrichedPost.createdAt}
        isAuthor={isAuthor}
        isProfile={isProfile}
        onEdit={() => setEditing(true)}
        onDelete={() => setDeleting(true)}
      />

      {editing && (
        <EditPostModal
          postId={enrichedPost.id}
          initialContent={enrichedPost.content}
          initialProgress={enrichedPost.progress}
          onClose={() => setEditing(false)}
          onSuccess={() => router.refresh()}
        />
      )}

      {deleting && (
        <DeletePostModal
          onClose={() => setDeleting(false)}
          onConfirm={async () => {
            await deletePost();
            setDeleting(false);
          }}
        />
      )}

      <PostBody post={enrichedPost} />

      <PostActions
        like={like}
        commentsCtrl={comments}
        viewerIsAuthenticated={isAuthenticated}
        onRequestSignIn={requestSignIn}
      />

      <PostComments comments={comments.comments} />
    </article>
  );
}
