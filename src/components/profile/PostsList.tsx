// File: src/components/profile/PostsList.tsx
'use client';

import React from 'react';
import PostCard from '@components/post/PostCard';
import type { ClientPost } from '@/src/types/posts';

interface Props {
    posts: ClientPost[];
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