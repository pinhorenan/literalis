import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@services/user.service';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const results = await UserService.search(q);
  return NextResponse.json(results);
}
