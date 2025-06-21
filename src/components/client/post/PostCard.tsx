// File: src/components/client/post/PostCard.tsx
'use client';

import React, { useRef, useState, useCallback } from 'react';
import clsx from 'clsx';
import { Heart, MessageCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import FollowButton   from '@components/client/ui/FollowButton';
import OptionsMenu    from '@components/client/ui/OptionsMenu';
import BookCover      from '@components/server/book/BookCover';           // << client version
import BookInfo       from '@components/server/book/BookInfo';           // << server version
import PostComments   from '@components/client/post/PostComments';
import UserSummary    from '@components/server/user/UserSummary';

import useRelativeTime from '@hooks/useRelativeTime';
import usePostLike     from '@hooks/usePostLike';
import useComments     from '@hooks/useComments';

import type { PostDTO } from '@dto/post.dto';

interface Props {
  post: PostDTO;
  isProfile?: boolean;
  onFollowChange?: (nowFollowing: boolean) => void;
}

export default function PostCard({
  post,
  isProfile = false,
  onFollowChange,
}: Props) {
  const { data: session, status } = useSession();
  const isOwner = session?.user.username === post.author.username;
  const router = useRouter();

  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const relativeTime = useRelativeTime(post.createdAt);

  const { liked, likeCount, loading: likeLoading, toggleLike } = usePostLike(
    post.id,
    post.likedByMe,
    post.likeCount
  );

  const { comments, loading: commentLoading, addComment } = useComments(
    post.id,
    post.commentsPreview
  );

  const handleToggleLike = useCallback(() => {
    if (status !== 'authenticated') {
      router.push('/signin');
    } else {
      toggleLike();
    }
  }, [status, router, toggleLike]);

  const handleComment = useCallback(() => {
    const text = draft.trim();
    if (!text) {
      inputRef.current?.focus();
      return;
    }
    addComment(text);
    setDraft('');
    inputRef.current?.focus();
  }, [draft, addComment]);

  return (
    <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-muted)] border-b border-[var(--border-base)]">
        <div className="flex items-center gap-3">
          <UserSummary user={post.author} size="md" />
          <time className="text-xs text-[var(--text-secondary)] ml-2 shrink-0">
            há {relativeTime}
          </time>
        </div>

        {!isProfile && !isOwner && (
          <FollowButton
            targetUsername={post.author.username}
            initialFollowing={post.isFollowingAuthor}
            onToggle={onFollowChange}
            className="text-md"
          />
        )}

        {isOwner && (
          <OptionsMenu
            onEdit={()   => console.log('editar post', post.id)}
            onDelete={() => console.log('excluir post', post.id)}
          />
        )}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-4">
        <div className="flex gap-4">
          <BookCover
            book={post.book}
            inShelf={post.isInMyBookshelf}
            width={120}
            height={180}
            className="group"
          />
          <BookInfo
            book={post.book}
            className="mt-2 space-y-2"
          />
        </div>

        <div className="flex flex-col justify-between gap-4">
          <p className="text-sm text-[var(--text-primary)]">{post.content}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 bg-[var(--color-secondary)] border border-[var(--border-base)] rounded overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)]"
                style={{ width: `${post.progress}%` }}
              />
            </div>
            <span className="text-sm font-medium">{post.progress}% lido</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-t border-[var(--border-base)]">
        <button
          onClick={handleToggleLike}
          disabled={likeLoading}
          className="flex items-center gap-1 hover:text-[var(--text-primary)]"
          title={liked ? 'Descurtir' : 'Curtir'}
          aria-pressed={liked}
        >
          <Heart
            className={clsx('cursor-pointer', liked && 'fill-current text-[var(--text-primary)]')}
          />
          <span className="text-sm text-[var(--text-secondary)]">{likeCount}</span>
        </button>

        <button
          onClick={handleComment}
          disabled={commentLoading}
          className="flex items-center gap-1 hover:text-[var(--text-primary)]"
          title="Comentar"
        >
          <MessageCircle className="text-[var(--text-primary)]" />
          <span className="text-sm text-[var(--text-secondary)]">{comments.length}</span>
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Escreva um comentário…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleComment()}
          className="flex-1 border border-[var(--border-subtle)] rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--border-hover)]"
        />
      </div>

      <PostComments comments={comments} />
    </article>
  );
}
