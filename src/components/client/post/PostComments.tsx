// File: src/components/client/post/PostComments.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import UserAvatar from '@components/server/user/UserAvatar';

import useRelativeTime from '@hooks/useRelativeTime';
import type { CommentDTO } from '@dto/comment.dto';

interface Props {
  comments: CommentDTO[];
}

export default function PostComments({ comments }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [height, setHeight] = useState(0);

  const fullRef = useRef<HTMLDivElement>(null);
  const limitedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = showAll ? fullRef.current : limitedRef.current;
    const updateHeight = () => {
      if (target) setHeight(target.scrollHeight);
    };
    updateHeight();
    const obs = new ResizeObserver(updateHeight);
    if (target) obs.observe(target);
    return () => obs.disconnect();
  }, [showAll, comments.length]);

  if (!comments.length) {
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
          {comments.map(c => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>
        <div ref={limitedRef} className="invisible absolute top-0 left-0 pointer-events-none">
          {comments.slice(0, 2).map(c => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>
      </div>

      {comments.length > 2 && (
        <button
          className="text-sm text-[var(--text-primary)] cursor-pointer hover:underline block mx-auto mt-3"
          onClick={() => setShowAll(s => !s)}
        >
          <strong>{showAll ? 'Exibir menos' : `Ver mais (${comments.length - 2})`}</strong>
        </button>
      )}
    </div>
  );
}

function CommentItem({ comment }: { comment: CommentDTO }) {
  const time = useRelativeTime(comment.createdAt);

  return (
    <div className="flex items-start gap-3">
      <UserAvatar user={comment.author} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <Link
            href={`/profile/${comment.author.username}`}
            className="font-medium text-sm text-[var(--text-primary)] hover:underline"
          >
            {comment.author.name}
          </Link>
          <time className="text-xs text-[var(--text-tertiary)] whitespace-nowrap">
            há {time}
          </time>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{comment.content}</p>
      </div>
    </div>
  );
}
