// File: src/lib/openLibrary.ts

const FIELDS = [
    'title',
    'author_name',
    'isbn',
    'cover_i',
    'publisher',
    'first_publish_year',
    'language',
    'edition_key'
].join(',');

export interface OpenLibraryBook {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    edition: string;
    language: string;
    external: true;
    coverUrl?: string;
    pages?: number;
}

export async function searchOpenLibrary(q: string, limit = 20): Promise<OpenLibraryBook[]> {
    if (!q) return [];

    const url = `https://openlibrary.org/search.json?` +
                `q=${encodeURIComponent(q)}&limit=${limit}$fields=${FIELDS}`;

    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1h em edge
    if (!res.ok) throw new Error('OpenLibrary search failed');

    const { docs } = await res.json();
    
    return docs.map((doc: any): OpenLibraryBook => {
        // 1) ISBN preferindo 13 dígitos
        const isbn13 = doc.isbn?.find((isbn: string) => isbn.length === 13);
        const isbn10 = doc.isbn?.find((isbn: string) => isbn.length === 10);
        const isbn = isbn13 ?? isbn10 ?? doc.isbn?.[0] ?? doc.edition_key?.[0];

        return {
            isbn,
            title: doc.title,
            author: doc.author_name?.join(', ') ?? 'Autor desconhecido',
            publisher: doc.publisher?.[0] ?? 'Editora desconhecida',
            edition: doc.edition.key?.[0] ?? '',
            pages: 0, // OpenLibrary doesn't provide page count in search results
            language: doc.language?.[0] ?? '',
            coverUrl: doc.cover_i
                ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                : '/images/book-placeholer.svg',
            external: true
        };
    });
}