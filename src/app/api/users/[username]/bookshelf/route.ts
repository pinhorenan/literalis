// src/app/api/users/[username]/bookshelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserBookService } from '@services/server/userBook.service';

export async function GET(
  _: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  const books = await UserBookService.getPublicForUser(username);

  return NextResponse.json(books);
}
