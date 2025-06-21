// File: src/types/dto/book.dto.ts
export type BookDTO = {
    isbn:               string;
    title:              string;
    author:             string;
    coverUrl:           string;

    publisher?:         string;
    edition?:           number;
    pages?:             number;
    language?:          string;
    publicationDate?:   string;

    external?:          boolean;
};

export type BookOption = {
    isbn:       string;
    title:      string;
    pages:      number;
    coverUrl:   string;
};