// src/app/api/users/[username]/bookshelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BookshelfService } from '@services/server/bookshelf.service';

export async function GET(
  _: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  const books = await BookshelfService.getPublicForUser(username);

  return NextResponse.json(books);
}
