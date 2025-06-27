import { updateEntry, removeEntry } from '@clients/bookshelf.client';
import { getBookByIsbn } from '@clients/book.client';

export const BookshelfService = {
  async update(isbn: string, { progressPct }: { progressPct: number }) {
    const book = await getBookByIsbn(isbn);
    const currentPage = book.pages
      ? Math.round((book.pages * progressPct) / 100)
      : 0;
    return updateEntry(isbn, { currentPage });
  },

  async updateProgress(isbn: string, currentPage: number) {
    return updateEntry(isbn, { currentPage });
  },

  async remove(isbn: string) {
    return removeEntry(isbn);
  },
};
