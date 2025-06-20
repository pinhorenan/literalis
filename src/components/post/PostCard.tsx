// File: src/components/post/Post.tsx
'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useRef, useState, useCallback } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import FollowButton         from '@components/ui/FollowButton';
import OptionsMenu          from '@components/ui/OptionsMenu';
import BookCover            from '@components/book/BookCover';
import BookInfo             from '@components/book/BookInfo';
import PostComments         from '@components/post/PostComments';
import UserAvatar           from '@components/user/UserAvatar';

import useRelativeTime      from '@hooks/useRelativeTime';
import usePostLike          from '@hooks/usePostLike';
import useComments          from '@hooks/useComments';

import type { ClientPost }  from '@/src/types/posts';
import { relative } from 'path';

interface Props {
  post: ClientPost;
  isProfile?: boolean;
  onFollowChange?: (nowFollowing: boolean) => void;
}

export default function PostCard({ post, isProfile = false, onFollowChange }: Props) {
  const { data: session, status } = useSession();
  const isOwner = session?.user.username === post.author.username;
  const router = useRouter();

  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const relativeTime = useRelativeTime(post.createdAt);
  const progress = post.progress ?? 0;

  const { liked, likeCount, loading: likeLoading, toggleLike } = usePostLike(
    post.id, 
    post.likedByMe, 
    post.likeCount
  );

  const { comments, loading: commentLoading, addComment } = useComments(
    post.id, 
    post.comments
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
    if (!text) return inputRef.current?.focus();
    addComment(text);
    setDraft('');
    inputRef.current?.focus();
  }, [draft, addComment]);

  const bookInfoProps = {
    ...post.book,
    publisher:        post.book.publisher ?? 'Desconhecida',
    edition:          post.book.edition ?? 1,
    pages:            post.book.pages ?? 0,
    language:         post.book.language ?? 'Português',
    publicationDate:  post.book.publicationDate
      ? new Date(post.book.publicationDate)
      : new Date(),
    coverUrl:         post.book.coverUrl,
  }


  return (
      <article className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-muted)] border-b border-[var(--border-base)]">
          <div className="flex items-center gap-3">
            <UserAvatar user={post.author} size="md" redirect />
            <div>
              <Link
                href={`/profile/${post.author.username}`}
                className="font-medium text-sm text-[var(--text-primary)] hover:underline"
              >
                {post.author.name}
              </Link>
              <time className="text-xs text-[var(--text-secondary)] ml-2">
                há {relativeTime}
              </time>
            </div>
          </div>

          {!isProfile && !isOwner &&(
            <FollowButton
              key={post.author.username}
              targetUsername={post.author.username}
              initialFollowing={post.isFollowingAuthor}
              onToggle={onFollowChange}
              className="text-xs"
            />
          )}

          {isOwner && (
            <div className="ml-2">
              <OptionsMenu
                onEdit={() => console.log('editar post', post.id)}
                onDelete={() => console.log('excluir post', post.id)}
              />
            </div>
          )}
        </div>

        {/* Corpo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-4">
          <div className="flex gap-4">
            <BookCover
              src={post.book.coverUrl}
              alt={`Capa: ${post.book.title}`}
              width={120}
              height={180}
              href={`/books/${post.book.isbn}`}
              addable
            />
            <BookInfo
              book={bookInfoProps}
              className="mt-2 space-y-2"
              showPublicationDate
              strongIsbnLabel
            />
          </div>

          <div className="flex flex-col justify-between gap-4">
            <p className="text-sm text-[var(--text-primary)]">{post.excerpt}</p>
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

        {/* Ações */}
        <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-t border-[var(--border-base)]">
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleLike}
              disabled={likeLoading}
              className="flex items-center gap-1 hover:text-[var(--text-primary)]"
              title={liked ? 'Descurtir' : 'Curtir'}
              aria-pressed={liked}
            >
              <Heart
                className={clsx(
                  'cursor-pointer',
                   liked && 'fill-current text-[var(--text-primary)]')}
                />
              <span className="text-sm text-[var(--text-secondary)]">
                {likeCount}
              </span>
            </button>
              
            <button
              onClick={handleComment}
              disabled={commentLoading}
              className="flex items-center gap-1 hover:text-[var(--text-primary)]"
              title="Comentar"
            >
              <MessageCircle className="text-[var(--text-primary)]"/>
              <span className="text-sm text-[var(--text-secondary)]">
                {comments.length}
              </span>
            </button>
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Escreva um comentário…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            className="flex-1 border border-[var(--border-subtle)] rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--border-hover)]"
            />
        </div>

      <PostComments comments={comments} />
    </article>
  );
}
