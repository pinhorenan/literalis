// src/app/api/users/suggestions/route.ts
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getSuggestedUsers } from '@/src/server/users/suggestions';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? '5');

  const suggestions = await getSuggestedUsers(session.user.id, limit);
  return NextResponse.json(suggestions, { status: 200 });
}
