// src/app/api/search/route.ts
import { SearchService } from '@services/search.service';
import { NextResponse } from 'next/server';

const searchService = new SearchService();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('query')?.trim() ?? '';
    const userLimit = Number(url.searchParams.get('userLimit') ?? 20);
    const bookLimit = Number(url.searchParams.get('bookLimit') ?? 20);

    const results = await searchService.search(q, userLimit, bookLimit);
    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
