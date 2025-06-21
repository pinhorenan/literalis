// File: pages/api/openLibrary.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import type { BookDTO } from '@dto/book.dto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookDTO[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  const q     = String(req.query.q || '');
  const limit = parseInt(String(req.query.limit || '20'), 10);

  if (!q) {
    return res.status(400).json({ error: 'Parâmetro q é obrigatório' });
  }

  try {
    const apiRes = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=${limit}`);
    if (!apiRes.ok) {
      throw new Error(`OpenLibrary retornou ${apiRes.status}`);
    }
    const data = await apiRes.json();

    const books: BookDTO[] = (data.docs || []).map((doc: any) => ({
      isbn:             Array.isArray(doc.isbn) ? doc.isbn[0] : doc.isbn?.[0] || '',
      title:            doc.title,
      author:           (doc.author_name && doc.author_name[0]) || 'Desconhecido',
      coverUrl:         doc.cover_i
                          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
                          : '/assets/default-cover.png',
      publisher:        (doc.publisher && doc.publisher[0]) || undefined,
      edition:          doc.edition_count,
      pages:            doc.number_of_pages_median,
      language:         (doc.language && doc.language[0]) || undefined,
      publicationDate:  doc.first_publish_year?.toString(),
      external:         true,
    }));

    return res.status(200).json(books);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao buscar no OpenLibrary' });
  }
}
