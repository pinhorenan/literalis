import type { BookDTO, MinimalBookDTO } from '@/src/hooks/types/book.type';

function olCover(isbn: string, size: 'S' | 'M' | 'L' = 'M') {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}

export const bookMock1: BookDTO = {
  isbn: '9780140449136', // Crime and Punishment
  title: 'Crime and Punishment',
  authors: ['Fyodor Dostoyevsky'],
  publisher: 'Penguin Classics',
  edition: 1,
  pages: 720,
  language: 'English',
  publicationDate: new Date('2002-12-31'),
  coverUrl: olCover('9780140449136', 'L'),
  external: true,
};
export const minimalBookMock1: MinimalBookDTO = {
  title: bookMock1.title,
  authors: bookMock1.authors,
  pages: bookMock1.pages,
  coverUrl: bookMock1.coverUrl,
};

export const bookMock2: BookDTO = {
  isbn: '9780307277671', // The Da Vinci Code
  title: 'The Da Vinci Code',
  authors: ['Dan Brown'],
  publisher: 'Vintage',
  edition: 1,
  pages: 480,
  language: 'English',
  publicationDate: new Date('2006-03-28'),
  coverUrl: olCover('9780307277671', 'L'),
  external: true,
};
export const minimalBookMock2: MinimalBookDTO = {
  title: bookMock2.title,
  authors: bookMock2.authors,
  pages: bookMock2.pages,
  coverUrl: bookMock2.coverUrl,
};

export const bookMock3: BookDTO = {
  isbn: '9780140449181', // Crime and Punishment, 2nd ed.
  title: 'Crime and Punishment',
  authors: ['Fyodor Dostoyevsky'],
  publisher: 'Penguin Classics',
  edition: 2,
  pages: 718,
  language: 'English',
  publicationDate: new Date('2018-10-09'),
  coverUrl: olCover('9780140449181', 'L'),
  external: true,
};
export const minimalBookMock3: MinimalBookDTO = {
  title: bookMock3.title,
  authors: bookMock3.authors,
  pages: bookMock3.pages,
  coverUrl: bookMock3.coverUrl,
};

export const bookMock4: BookDTO = {
  isbn: '9780140449273', // Crime and Punishment (Audiobook)
  title: 'Crime and Punishment (Audiobook)',
  authors: ['Fyodor Dostoyevsky'],
  publisher: 'Penguin Audio',
  edition: 1,
  pages: 0,
  language: 'English',
  publicationDate: new Date('2005-06-16'),
  coverUrl: olCover('9780140449273', 'L'),
  external: true,
};
export const minimalBookMock4: MinimalBookDTO = {
  title: bookMock4.title,
  authors: bookMock4.authors,
  pages: bookMock4.pages,
  coverUrl: bookMock4.coverUrl,
};

export const bookMock5: BookDTO = {
  isbn: '1122334455667', // Aprendizado React Moderno (interno)
  title: 'Aprendizado React Moderno',
  authors: ['Seu Nome'],
  publisher: 'Literalis Press',
  edition: 1,
  pages: 250,
  language: 'Portuguese',
  publicationDate: new Date('2025-01-01'),
  coverUrl: olCover('1122334455667', 'L'),
  external: false,
};
export const minimalBookMock5: MinimalBookDTO = {
  title: bookMock5.title,
  authors: bookMock5.authors,
  pages: bookMock5.pages,
  coverUrl: bookMock5.coverUrl,
};
// Already have 1–5, adicionando 6 a 30
export const bookMock6: BookDTO = {
  isbn: '9780061120084',
  title: 'To Kill a Mockingbird',
  authors: ['Harper Lee'],
  publisher: 'Harper Perennial Modern Classics',
  edition: 1,
  pages: 336,
  language: 'English',
  publicationDate: new Date('2006-05-23'),
  coverUrl: olCover('9780061120084', 'L'),
  external: true,
};
export const minimalBookMock6: MinimalBookDTO = {
  title: bookMock6.title,
  authors: bookMock6.authors,
  pages: bookMock6.pages,
  coverUrl: bookMock6.coverUrl,
};

export const bookMock7: BookDTO = {
  isbn: '9781897457801',
  title: 'Complete ScienceSmart 8',
  authors: ['Popular Book Popular Book Company'],
  publisher: 'Popular Book Company (Canada) Limited',
  edition: 1,
  pages: 232,
  language: 'English',
  publicationDate: new Date('2010-01-01'),
  coverUrl: olCover('9781897457801', 'L'),
  external: true,
};
export const minimalBookMock7: MinimalBookDTO = {
  title: bookMock7.title,
  authors: bookMock7.authors,
  pages: bookMock7.pages,
  coverUrl: bookMock7.coverUrl,
};

export const bookMock8: BookDTO = {
  isbn: '9781771490306',
  title: 'Complete Canadian Curriculum Gr.2',
  authors: ['Popular Book Editorial'],
  publisher: 'Popular Book Editorial',
  edition: 1,
  pages: 200,
  language: 'English',
  publicationDate: new Date('2015-01-01'),
  coverUrl: olCover('9781771490306', 'L'),
  external: true,
};
export const minimalBookMock8: MinimalBookDTO = {
  title: bookMock8.title,
  authors: bookMock8.authors,
  pages: bookMock8.pages,
  coverUrl: bookMock8.coverUrl,
};

export const bookMock9: BookDTO = {
  isbn: '9781927042151',
  title: 'Canadian Curriculum MathSmart 6',
  authors: ['Popular Book Popular Book Company'],
  publisher: 'Popular Book Company (Canada) Limited',
  edition: 1,
  pages: 80,
  language: 'English',
  publicationDate: new Date('2013-01-01'),
  coverUrl: olCover('9781927042151', 'L'),
  external: true,
};
export const minimalBookMock9: MinimalBookDTO = {
  title: bookMock9.title,
  authors: bookMock9.authors,
  pages: bookMock9.pages,
  coverUrl: bookMock9.coverUrl,
};

export const bookMock10: BookDTO = {
  isbn: '9781897457511',
  title: 'FrenchSmart 6',
  authors: ['Popular Book Popular Book Company'],
  publisher: 'Popular Book Company (Canada) Limited',
  edition: 1,
  pages: 120,
  language: 'French',
  publicationDate: new Date('2009-01-01'),
  coverUrl: olCover('9781897457511', 'L'),
  external: true,
};
export const minimalBookMock10: MinimalBookDTO = {
  title: bookMock10.title,
  authors: bookMock10.authors,
  pages: bookMock10.pages,
  coverUrl: bookMock10.coverUrl,
};

export const bookMock11: BookDTO = {
  isbn: '9781960500229',
  title: 'Bilingual Spanish-English Success',
  authors: ['Popular Book Company USA'],
  publisher: 'Popular Book Company USA',
  edition: 1,
  pages: 80,
  language: 'English',
  publicationDate: new Date('2020-01-01'),
  coverUrl: olCover('9781960500229', 'L'),
  external: true,
};
export const minimalBookMock11: MinimalBookDTO = {
  title: bookMock11.title,
  authors: bookMock11.authors,
  pages: bookMock11.pages,
  coverUrl: bookMock11.coverUrl,
};

export const bookMock12: BookDTO = {
  isbn: '9781960500526',
  title: 'Complete English Success - Grade 4',
  authors: ['Popular Book Company USA'],
  publisher: 'Popular Book Company USA',
  edition: 1,
  pages: 0,
  language: 'English',
  publicationDate: new Date('2024-01-01'),
  coverUrl: olCover('9781960500526', 'L'),
  external: true,
};
export const minimalBookMock12: MinimalBookDTO = {
  title: bookMock12.title,
  authors: bookMock12.authors,
  pages: bookMock12.pages,
  coverUrl: bookMock12.coverUrl,
};

export const bookMock13: BookDTO = {
  isbn: '9781960500298',
  title: 'Complete Math Success - Grade 3',
  authors: ['Popular Book Company (USA) Ltd.'],
  publisher: 'Popular Book Company (USA) Ltd.',
  edition: 1,
  pages: 0,
  language: 'English',
  publicationDate: new Date('2023-01-01'),
  coverUrl: olCover('9781960500298', 'L'),
  external: true,
};
export const minimalBookMock13: MinimalBookDTO = {
  title: bookMock13.title,
  authors: bookMock13.authors,
  pages: bookMock13.pages,
  coverUrl: bookMock13.coverUrl,
};

export const bookMock14: BookDTO = {
  isbn: '9780385472579',
  title: 'Zen and the Art of Motorcycle Maintenance',
  authors: ['Robert M. Pirsig'],
  publisher: 'HarperTorch',
  edition: 1,
  pages: 540,
  language: 'English',
  publicationDate: new Date('1974-04-21'),
  coverUrl: olCover('9780385472579', 'L'),
  external: true,
};
export const minimalBookMock14: MinimalBookDTO = {
  title: bookMock14.title,
  authors: bookMock14.authors,
  pages: bookMock14.pages,
  coverUrl: olCover('9780385472579', 'M'),
};

export const bookMock15: BookDTO = {
  isbn: '9780307387899',
  title: 'The Road',
  authors: ['Cormac McCarthy'],
  publisher: 'Vintage',
  edition: 1,
  pages: 241,
  language: 'English',
  publicationDate: new Date('2006-09-26'),
  coverUrl: olCover('9780307387899', 'L'),
  external: true,
};
export const minimalBookMock15: MinimalBookDTO = {
  title: bookMock15.title,
  authors: bookMock15.authors,
  pages: bookMock15.pages,
  coverUrl: olCover('9780307387899', 'M'),
};

export const bookMock16: BookDTO = {
  isbn: '9780679783268',
  title: 'Pride and Prejudice',
  authors: ['Jane Austen'],
  publisher: 'Modern Library',
  edition: 1,
  pages: 279,
  language: 'English',
  publicationDate: new Date('2000-11-01'),
  coverUrl: olCover('9780679783268', 'L'),
  external: true,
};
export const minimalBookMock16: MinimalBookDTO = {
  title: bookMock16.title,
  authors: bookMock16.authors,
  pages: bookMock16.pages,
  coverUrl: olCover('9780679783268', 'M'),
};

export const bookMock17: BookDTO = {
  isbn: '9780140449266',
  title: 'Les Misérables',
  authors: ['Victor Hugo'],
  publisher: 'Penguin Classics',
  edition: 1,
  pages: 1488,
  language: 'English',
  publicationDate: new Date('1987-11-01'),
  coverUrl: olCover('9780140449266', 'L'),
  external: true,
};
export const minimalBookMock17: MinimalBookDTO = {
  title: bookMock17.title,
  authors: bookMock17.authors,
  pages: bookMock17.pages,
  coverUrl: olCover('9780140449266', 'M'),
};

export const bookMock18: BookDTO = {
  isbn: '9780140186390',
  title: 'On the Road',
  authors: ['Jack Kerouac'],
  publisher: 'Penguin Classics',
  edition: 1,
  pages: 320,
  language: 'English',
  publicationDate: new Date('1999-09-01'),
  coverUrl: olCover('9780140186390', 'L'),
  external: true,
};
export const minimalBookMock18: MinimalBookDTO = {
  title: bookMock18.title,
  authors: bookMock18.authors,
  pages: bookMock18.pages,
  coverUrl: olCover('9780140186390', 'M'),
};

export const bookMock19: BookDTO = {
  isbn: '9780307277671',
  title: 'The Da Vinci Code',
  authors: ['Dan Brown'],
  publisher: 'Doubleday',
  edition: 2,
  pages: 489,
  language: 'English',
  publicationDate: new Date('2003-03-18'),
  coverUrl: olCover('9780307277671', 'L'),
  external: true,
};
export const minimalBookMock19: MinimalBookDTO = {
  title: bookMock19.title,
  authors: bookMock19.authors,
  pages: bookMock19.pages,
  coverUrl: olCover('9780307277671', 'M'),
};

export const bookMock20: BookDTO = {
  isbn: '9780553296983',
  title: 'Dune',
  authors: ['Frank Herbert'],
  publisher: 'Ace',
  edition: 1,
  pages: 896,
  language: 'English',
  publicationDate: new Date('1990-08-01'),
  coverUrl: olCover('9780553296983', 'L'),
  external: true,
};
export const minimalBookMock20: MinimalBookDTO = {
  title: bookMock20.title,
  authors: bookMock20.authors,
  pages: bookMock20.pages,
  coverUrl: olCover('9780553296983', 'M'),
};

export const bookMock21: BookDTO = {
  isbn: '9780743273565',
  title: 'The Great Gatsby',
  authors: ['F. Scott Fitzgerald'],
  publisher: 'Scribner',
  edition: 1,
  pages: 180,
  language: 'English',
  publicationDate: new Date('2004-09-30'),
  coverUrl: olCover('9780743273565', 'L'),
  external: true,
};
export const minimalBookMock21: MinimalBookDTO = {
  title: bookMock21.title,
  authors: bookMock21.authors,
  pages: bookMock21.pages,
  coverUrl: olCover('9780743273565', 'M'),
};

export const bookMock22: BookDTO = {
  isbn: '9780307277672',
  title: 'Angels & Demons',
  authors: ['Dan Brown'],
  publisher: 'Pocket Books',
  edition: 1,
  pages: 736,
  language: 'English',
  publicationDate: new Date('2003-05-01'),
  coverUrl: olCover('9780307277672', 'L'),
  external: true,
};
export const minimalBookMock22: MinimalBookDTO = {
  title: bookMock22.title,
  authors: bookMock22.authors,
  pages: bookMock22.pages,
  coverUrl: olCover('9780307277672', 'M'),
};

export const bookMock23: BookDTO = {
  isbn: '9780142437230',
  title: 'Moby-Dick',
  authors: ['Herman Melville'],
  publisher: 'Penguin Classics',
  edition: 1,
  pages: 720,
  language: 'English',
  publicationDate: new Date('2002-12-01'),
  coverUrl: olCover('9780142437230', 'L'),
  external: true,
};
export const minimalBookMock23: MinimalBookDTO = {
  title: bookMock23.title,
  authors: bookMock23.authors,
  pages: bookMock23.pages,
  coverUrl: olCover('9780142437230', 'M'),
};

export const bookMock24: BookDTO = {
  isbn: '9780140444332',
  title: 'Meditations',
  authors: ['Marcus Aurelius'],
  publisher: 'Penguin Classics',
  edition: 1,
  pages: 304,
  language: 'English',
  publicationDate: new Date('2006-05-30'),
  coverUrl: olCover('9780140444332', 'L'),
  external: true,
};
export const minimalBookMock24: MinimalBookDTO = {
  title: bookMock24.title,
  authors: bookMock24.authors,
  pages: bookMock24.pages,
  coverUrl: olCover('9780140444332', 'M'),
};

export const bookMock25: BookDTO = {
  isbn: '9780140441599',
  title: 'The Prince',
  authors: ['Niccolò Machiavelli'],
  publisher: 'Penguin Classics',
  edition: 1,
  pages: 144,
  language: 'English',
  publicationDate: new Date('2003-09-30'),
  coverUrl: olCover('9780140441599', 'L'),
  external: true,
};
export const minimalBookMock25: MinimalBookDTO = {
  title: bookMock25.title,
  authors: bookMock25.authors,
  pages: bookMock25.pages,
  coverUrl: olCover('9780140441599', 'M'),
};

export const bookMock26: BookDTO = {
  isbn: '9780140449181',
  title: 'Crime and Punishment',
  authors: ['Fyodor Dostoyevsky'],
  publisher: 'Penguin Classics',
  edition: 3,
  pages: 720,
  language: 'English',
  publicationDate: new Date('2010-10-09'),
  coverUrl: olCover('9780140449181', 'L'),
  external: true,
};
export const minimalBookMock26: MinimalBookDTO = {
  title: bookMock26.title,
  authors: bookMock26.authors,
  pages: bookMock26.pages,
  coverUrl: olCover('9780140449181', 'M'),
};

export const bookMock27: BookDTO = {
  isbn: '9780140449273',
  title: 'Anna Karenina',
  authors: ['Leo Tolstoy'],
  publisher: 'Penguin Classics',
  edition: 1,
  pages: 880,
  language: 'English',
  publicationDate: new Date('2003-04-15'),
  coverUrl: olCover('9780140449273', 'L'),
  external: true,
};
export const minimalBookMock27: MinimalBookDTO = {
  title: bookMock27.title,
  authors: bookMock27.authors,
  pages: bookMock27.pages,
  coverUrl: olCover('9780140449273', 'M'),
};

export const bookMock28: BookDTO = {
  isbn: '9780140449274',
  title: 'War and Peace',
  authors: ['Leo Tolstoy'],
  publisher: 'Penguin Classics',
  edition: 1,
  pages: 1296,
  language: 'English',
  publicationDate: new Date('2007-05-01'),
  coverUrl: olCover('9780140449274', 'L'),
  external: true,
};
export const minimalBookMock28: MinimalBookDTO = {
  title: bookMock28.title,
  authors: bookMock28.authors,
  pages: bookMock28.pages,
  coverUrl: olCover('9780140449274', 'M'),
};
