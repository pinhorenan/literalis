// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@services/server/user.service';

export async function GET(_: NextRequest) {
    const users = await UserService.listAll();
    return NextResponse.json(users, { status: 200 });
}