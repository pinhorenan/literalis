// app/api/users/[username]/bookshelf/count/route.ts
import { NextResponse } from 'next/server';
import { getUserByUsername, countBooksInShelf } from '@/services/user.service';

export async function GET(_: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });

  const books = await countBooksInShelf(user.id);
  return NextResponse.json({ books });
}
