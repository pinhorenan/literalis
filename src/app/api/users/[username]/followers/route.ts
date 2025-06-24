import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@services/user.service';

export async function GET(req: NextRequest, { params }) {
  const limit  = Number(req.nextUrl.searchParams.get('limit') ?? '20');
  const cursor = req.nextUrl.searchParams.get('cursor') ?? undefined;

  const data = await UserService.listFollowers(params.username, limit, cursor);
  return NextResponse.json(data);
}
