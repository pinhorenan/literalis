import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/src/components/ui/core/carousel';
import { BookDTO } from '@/src/models/bookModels';
import BookCover from '@/src/components/book/BookCover';

export default function HomePage() {
  const bookMock: BookDTO = {
    isbn: '12345',
    title: 'mock book',
    authors: ['author'],
    publisher: 'unkown',
    edition: 2,
    pages: 243,
    language: 'pt',
    publicationDate: new Date(),
    coverUrl: '/uploads/covers/default.jpg',
    external: false,
  };

  return (
    <main className="border-border mx-10 my-5 flex flex-col border">
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
      <section className="border-b-accent-strong flex flex-col items-center justify-center border-t">
        <h1>Aqui vai ter o feed principal</h1>
      </section>
    </main>
  );
}
