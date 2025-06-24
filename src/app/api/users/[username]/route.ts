import { UserService } from '@services/user.service';
import { getViewerSession } from '@services/viewer.service';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  try {
    const viewer = await getViewerSession(false);
    const profile = await UserService.getProfile(params.username, viewer?.username);
    return NextResponse.json(profile);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}

export async function PATCH(req: Request, { params }: { params: { username: string } }) {
  try {
    const viewer = await getViewerSession(true);
    if (viewer!.username !== params.username)
      return NextResponse.json({ error: 'Proibido' }, { status: 403 });

    const dto = await req.json();
    const updated = await UserService.update(dto);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
