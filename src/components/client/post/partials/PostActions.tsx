// src/components/client/post/PostActions.tsx
'use client';

import { useRef, useState, useCallback } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import type { CommentDTO } from '@/src/models/comment.model';

interface Props {
    like: {
        liked: boolean;
        likeCount: number;
        loading: boolean;
        toggleLike: () => void;
    };
    commentsCtrl: {
        comments: CommentDTO[];
        loading: boolean;
        addComment: (content: string) => void;
    };
    viewerIsAuthenticated: boolean;
    onRequestSignIn: () => void;
}

export default function PostActions({ 
    like,
    commentsCtrl,
    viewerIsAuthenticated,
    onRequestSignIn,
}: Props) {
    const [draft, setDraft] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleToggleLike = useCallback(() => {
        if (!viewerIsAuthenticated) {
            onRequestSignIn();
        } else {
            like.toggleLike();
        }
    }, [viewerIsAuthenticated, like.toggleLike, onRequestSignIn]);

    const handleComment = useCallback(() => {
        const content = draft.trim();
        if (!content) {
            inputRef.current?.focus();
            return;
        }
        commentsCtrl.addComment(content);
        setDraft('');
        inputRef.current?.focus();
    }, [draft, commentsCtrl.addComment]);

    return (
        <>
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-t border-[var(--border-base)]">
                <button
                    onClick={handleToggleLike}
                    disabled={like.loading}
                    className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
                    title={like.liked ? 'Descurtir' : 'Curtir'}
                    aria-pressed={like.liked}
                >
                    <Heart
                        className={clsx('cursor-pointer', like.liked && 'fill-current text-[var(--text-primary)]')}
                    />
                    <span className="text-sm text-[var(--text-secondary)]">{like.likeCount}</span>
                </button>

                <button
                    onClick={handleComment}
                    disabled={commentsCtrl.loading}
                    className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
                >
                    <MessageCircle className="text-[var(--text-primary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{commentsCtrl.comments.length}</span>
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
        </>
    );
}