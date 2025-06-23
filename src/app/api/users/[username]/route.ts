// src/app/api/users/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer } from '@lib/auth/viewer'
import { UserService } from '@services/server/user.service';

export async function GET(_: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const viewer = await getViewer();
    const { username } = await params;
    const user = await UserService.getByUsername(viewer?.username || null, username);

    if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const viewer = await getViewer();
    const { username } = await params;
    if (!viewer || viewer.username !== username) {
        return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const data = await req.json();
    const updated = await UserService.update(username, data);
    return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const viewer = await getViewer();
    const { username } = await params;
    if (!viewer || viewer.username !== username) {
        return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    await UserService.delete(username);
    return NextResponse.json({ message: 'Usuário deletado com sucesso.' }, { status: 200 });
}