// File: src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';
    const tab = searchParams.get('tab');

    if (!tab) {
        return NextResponse.json({ error: 'Tab parameter is required' }, { status: 400 });
    }

    if (!q) {
        return NextResponse.json([], { status: 200 });
    } 

    // busca dos livros
    if (tab === 'books') {
        const books = await prisma.book.findMany({
            where: {
                OR: [
                    { title:     { contains: q, mode: 'insensitive'} },
                    { author:    { contains: q, mode: 'insensitive'} },
                    { publisher: { contains: q, mode: 'insensitive'} },
                ],
            },
            take: 20,
            orderBy: { title: 'asc' },
        });
        return NextResponse.json(books);
    }

    // busca dos usuários
    if (tab === 'users') {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: q, mode: 'insensitive' } },
                    { name:     { contains: q, mode: 'insensitive' } },
                ],
            },
            take: 20,
            orderBy: { name: 'asc' },
            select: {
                username: true,
                name: true,
                avatarUrl: true,
            },
        });
        return NextResponse.json(users);
    }

    return NextResponse.json({ error: 'Valor de "tab" inválido.' }, { status: 400 });
}
