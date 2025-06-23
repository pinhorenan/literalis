// src/models/book.dto.ts

export interface BookDTO {
    isbn: string;
    title: string;     
    author: string; 
    publisher: string;     
    coverUrl: string;     
    language: string;     
    edition: number;     
    pages: number;     
    external: boolean;    
    publicationDate: Date;       
};

export interface MinimalBookDTO {
    isbn: string;
    title: string;
    author: string;
    coverUrl: string;
};

export interface CreateBookDTO {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    edition: number;
    pages: number;
    language: string;
    publicationDate: Date;
    coverUrl: string;
    external: boolean; 
};

export interface UpdateBookDTO {
    title: string;
    author: string;
    coverUrl: string;
    publisher: string;
    edition: number;
    pages: number;
    language: string;
    publicationDate: Date;
};