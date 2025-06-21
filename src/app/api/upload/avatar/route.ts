// File: app/api/upload/avatar/route.ts
import { NextRequest, NextResponse }  from 'next/server';
import { getServerSession }           from 'next-auth';
import { authOptions }                from '@server/auth';
import fs                             from 'fs/promises';
import path                           from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.username) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    };
    const username = session.user.username;

    const formData = await req.formData();
    const blob = formData.get('avatar');
    if (!(blob instanceof File)) {
      return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public/assets/avatars');
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(blob.name) || '';
    const fileName = `${username}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const arrayBuffer = await blob.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    
    const url = `public/assets/avatars/${fileName}`;
    return NextResponse.json({ url }, { status: 200 });
}