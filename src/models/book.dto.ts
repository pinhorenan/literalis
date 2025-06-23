// src/models/book.dto.ts
export type BookDTO = {
    isbn:               string;
    title:              string;
    author:             string;
    coverUrl:           string;
    external:           boolean;

    publisher?:         string;
    edition?:           number;
    pages?:             number;
    language?:          string;
    publicationDate?:   string;
};

export type CreateBookDTO = {
    isbn: string;
    title: string;
    author: string;
    pages: number;
    coverUrl?: string;
    publisher?: string;
    edition?: number;
    language?: string;
    publicationDate?: Date;
    external?: boolean;
};

export type UpdateBookDTO = {
    title?: string;
    author?: string;
    coverUrl?: string;
    publisher?: string;
    edition?: number;
    pages?: number;
    language?: string;
    publicationDate?: Date;
    external?: boolean;
};