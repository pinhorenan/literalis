import { UserService } from '@services/user.service';
import { NextResponse } from 'next/server';

export async function PATCH(_req: Request, { params }: { params: { username: string } }) {
  try {
    const result = await UserService.toggleFollow(params.username);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
