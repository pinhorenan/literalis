// src/app/api/users/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@services/server/user.service';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json([], { status: 200 });
    }

    const results = await UserService.search(query);
    return NextResponse.json(results, { status: 200 });
}