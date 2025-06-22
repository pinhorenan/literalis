// src/app/api/users/[username]/route.ts
import { db } from '@lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateSchema = z.object({
    name: z.string().min(1),
    bio: z.string().optional(),
    avatarUrl: z.string().url().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { username: string } }) {
    const body = await req.json();
    const data = updateSchema.safeParse(body);

    const updated = await db.user.update({
        where: { username: params.username },
        data,
        select: {
            username: true,
            name: true,
            avatarUrl: true,
            bio: true,
        },
    });

    return NextResponse.json(updated);
}