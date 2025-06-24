// src/components/client/post/PostHeader.tsx
'use client';

import React from 'react';
import useRelativeTime from '@hooks/global/useRelativeTime';

import UserSummary from '@components/server/user/UserSummary';
import FollowButton from '@components/client/ui/FollowButton';
import OptionsMenu from '@components/client/ui/OptionsMenu';
import type { UserDTO } from '@/src/models/user.model';

interface Props {
    author: UserDTO;
    createdAt: string;
    isAuthor: boolean;
    isProfile?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function PostHeader({
    author,
    createdAt,
    isAuthor,
    isProfile = false,
    onEdit,
    onDelete,
}: Props) {
    const relativeTime = useRelativeTime(createdAt);

    return (
        <div className="flex items-center justify-betweeen px-4 py-3 bg-[var(--surface-muted)] border-b border-[var(--border-base)]">
            <div className="flex items-center gap-3">
                <UserSummary user={author} size="md" />
                <time className="text-xs text-[var(--text-secondary)] ml-2 shrink-0">
                    há {relativeTime}
                </time>
            </div>

            {!isProfile && !isAuthor && (
                <FollowButton
                    targetUsername={author.username}
                    className="text-md"
                />
            )}

            {isAuthor && onEdit && onDelete && (
                <OptionsMenu onEdit={onEdit} onDelete={onDelete}
                />
            )}
        </div>
    );
}