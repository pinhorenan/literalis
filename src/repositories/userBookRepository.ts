// src/repository/userBook.repository.ts
import { db } from '@lib/db';
import { ShelfStatus } from '@prisma/client';
import { userBookInclude, userBookOptionSelect } from '@includes/userBook.include';
import type { UserBookCreateDTO, UserBookUpdateDTO } from '@models/userBook.dto';

export const UserBookRepository = {
    findUserBooks: (userUsername: string) => {
        return db.userBook.findMany({
            where: { userUsername },
            include: userBookInclude,
        });
    },

    findByUserAndBook: (userUsername: string, bookIsbn: string) => {
        return db.userBook.findUnique({
            where: {
                userUsername_bookIsbn: {
                    userUsername,
                    bookIsbn,
                },
            },
            include: userBookInclude,
        });
    },

    findBookOptionList: (userUsername: string) => {
        return db.userBook.findMany({
            where: { userUsername },
            select: userBookOptionSelect,
        });
    },

    create: (userUsername: string, bookIsbn: string, data?: Partial<UserBookCreateDTO>) => {
        return db.userBook.create({
            data: {
                userUsername,
                bookIsbn,
                ...data,
            },
        });
    },

    update: (userUsername: string, bookIsbn: string, data: Partial<UserBookUpdateDTO>) => {
        return db.userBook.update({
            where: {
                userUsername_bookIsbn: {
                    userUsername,
                    bookIsbn,
                },
            },
            data,
        });
    },

    delete: (userUsername: string, bookIsbn: string) => {
        return db.userBook.delete({
            where: { 
                userUsername_bookIsbn: { 
                    userUsername, 
                    bookIsbn, 
                }, 
            },
        });
    },
};