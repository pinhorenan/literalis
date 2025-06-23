// src/app/api/users/public/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@services/server/user.service';

export async function GET(_: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const user = await UserService.getPublicByUsername(username);

    if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
}