// File: src/components/post/PostComments.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import type { ClientComment } from '@/src/types/posts';
import useRelativeTime  from '@hooks/useRelativeTime';

export interface Props {
  comments: ClientComment[];
}

export default function PostComments({ comments }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [height, setHeight] = useState(0);

  const fullRef = useRef<HTMLDivElement>(null);
  const limitedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetRef = showAll ? fullRef : limitedRef;

    const resize = () => {
      if (targetRef.current) {
        setHeight(targetRef.current.scrollHeight);
      }
    };

    resize();

    const observer = new ResizeObserver(resize);
    if (targetRef.current) observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [showAll, comments.length]);

  if (comments.length === 0) {
    return (
      <p className="italic text-sm text-[var(--text-tertiary)] text-center my-6">
        Nenhum comentário ainda.
      </p>
    );
  }

  return (
    <div className="px-4 py-2">
      <div
        style={{
          maxHeight: `${height}px`,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease-in-out',
        }}
      >
        <div ref={fullRef} className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        <div
          ref={limitedRef}
          className="invisible absolute top-0 left-0 pointer-events-none h-auto"
          aria-hidden
        >
          {comments.slice(0, 2).map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>

      {comments.length > 2 && (
        <button
          className="text-sm text-[var(--text-primary)] cursor-pointer hover:underline block mx-auto mt-3"
          onClick={() => setShowAll((s) => !s)}
        >
          <strong>
            {showAll
              ? 'Exibir menos'
              : `Ver mais (${comments.length -2})`}
          </strong>
        </button>
      )}
    </div>
  );
}

function CommentItem({ comment }: { comment: ClientComment }) {
  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <Link href={`/profile/${comment.author.username}`}>
        <Image
          src={comment.author.avatarUrl || '/assets/avatars/default.jpg'}
          alt={comment.author.name ?? 'Usuário'}
          width={36}
          height={36}
          className="rounded-full border border-[var(--border-base)]"
        />
      </Link>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <Link 
            href={`/profile/${comment.author.username}`}
            className="font-medium text-sm text-[var(--text-primary)] hover:underline"
          >
            {comment.author.name}
          </Link>
          <time className="text-xs text-[var(--text-tertiary)] whitespace-nowrap">
            há {useRelativeTime(comment.createdAt)}
          </time>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{comment.content}</p>
      </div>
    </div>
  );
}
