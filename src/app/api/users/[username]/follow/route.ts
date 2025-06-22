// src/app/api/users/[username]/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewerSession } from '@/src/services/viewer.service';
import { db } from '@lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { username: string } }) {
    const session = await getViewerSession();
    const viewerUsername = session?.user?.username;

    if (!viewerUsername || viewerUsername === params.username) {
        return NextResponse.json({ error: 'Operação inválida.' }, { status: 403 });
    }

    const existing = await db.follow.findUnique({
        where: {
            followerUsername_followedUsername: {
                followerUsername: viewerUsername,
                followedUsername: params.username,
            },
        },
    });

    if (existing) {
        await db.follow.delete({ where: { followerUsername_followedUsername: existing } });
        return NextResponse.json({ followed: false });
    } else {
        await db.follow.create({
            data: {
                followerUsername: viewerUsername,
                followedUsername: params.username,
            },
        });
        return NextResponse.json({ followed: true });
    }
}