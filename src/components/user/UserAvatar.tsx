// File: src/components/user/UserAvatar.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


export interface UserAvatarProps {  
    user: {
        username: string;
        name: string;
        avatarUrl: string;
    }
    redirect?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl'; // sm=32px, md=48px, lg=64px, xl=94px
    className?: string;
}

export default function UserAvatar({
    user, 
    redirect = true, 
    size = 'md', 
    className = '',
}: UserAvatarProps) {
    const { username, name, avatarUrl } = user;
    const dimension = size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 94;

    const content = (
        <Image
            src={avatarUrl} alt={name}
            width={dimension} height={dimension}
            className={`rounded-full border border-[var(--border-subtle)] hover:border-[var(--border-base)] transition-colors duration-200 ease-in-out`}
        />
    );

    return redirect 
        ? <Link href={`/profile/${username}`}>{content}</Link>
        : content; 
}