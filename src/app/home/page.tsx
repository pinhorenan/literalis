'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/src/components/ui/carousel';
import { BookDTO } from '@/src/models/bookModels';
import BookCover from '@/src/components/book/BookCover';
import PostCard from '@/src/components/PostCard';

export default function HomePage() {
  const bookMock: BookDTO = {
    isbn: '9788535902773',
    title: '1984',
    authors: ['George Orwell'],
    publisher: 'Companhia das Letras',
    edition: 1,
    pages: 424,
    language: 'pt',
    publicationDate: new Date('2020-02-21'),
    coverUrl: '/uploads/covers/default.jpg',
    external: false,
  };

  const userMock = {
    name: 'Fabio',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  };

  const commentsMock = [
    {
      id: 1,
      user: {
        name: 'Carla Moreira',
        avatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
      text: 'Magnam voluptatem maiores omnis.',
      createdAt: 'há 2d',
    },
    {
      id: 2,
      user: {
        name: 'Nicolas Souza',
        avatarUrl: 'https://randomuser.me/api/portraits/men/51.jpg',
      },
      text: 'Muito bom esse livro!',
      createdAt: 'há 1d',
    },
  ];

  const postMock = {
    author: userMock,
    isFollowing: false,
    postedAt: 'há 2d',
    book: bookMock,
    progress: 90,
    description:
      'Doloremque dolorum ratione nam earum dolorem modi culpa. Facere molestias ipsa quo perspiciatis incidunt blanditiis ducimus. Nobis quam dicta commodi omnis.',
    likes: 6,
    comments: commentsMock,
    onFollow: () => alert('Seguir!'),
    onLike: () => alert('Curtiu!'),
  };

  const showCarousel = false;

  return (
    <main className="flex h-full w-full flex-1 flex-col">
      {showCarousel && (
        <Carousel className="bg-accent m-4 rounded-md p-6">
          <CarouselContent>
            <CarouselItem>
              <BookCover book={bookMock}></BookCover>
            </CarouselItem>
            <CarouselItem>
              <BookCover book={bookMock}></BookCover>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
      <section className="flex h-full flex-col items-center justify-center">
        <h1>Aqui vai ter o feed principal</h1>
        <section className="flex h-fit w-fit flex-1 flex-col">
          <PostCard {...postMock} />
        </section>
      </section>
    </main>
  );
}
