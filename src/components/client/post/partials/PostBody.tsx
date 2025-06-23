// src/components/client/post/PostBody.tsx
'use client';

import BookCover from '@components/server/book/BookCover';
import BookInfo from '@components/server/book/BookInfo';
import type { PostDTO } from '@models/post.dto';

export default function PostBody({ post }: { post: PostDTO }) {
    return (
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
                <div className="flex items-center gap2">
                    <div className="flex-1 h-3 bg-[var(--color-secondary)] border border0[var(--border-base)] rounded overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)]"
                            style={{ width: `${post.progress}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium">{post.progress}% lido</span>
                </div>
            </div>
        </div>
    );
}