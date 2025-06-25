// src/app/api/profile/[username]/route.ts
import { ProfileService } from '@services/profile.service';
import { NextResponse } from 'next/server';

const profileService = new ProfileService();

export async function GET(req: Request, { params }: { params: { username: string } }) {
  try {
    // extrair currentUser de session, se houver
    const currentUser = req.headers.get('x-username') ?? undefined;
    const dto = await profileService.getPublicProfile(params.username, currentUser);
    return NextResponse.json(dto);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('não encontrado') ? 404 : 500 },
    );
  }
}
