import type { MinimalUserDTO } from '../../hooks/types/user.type';
import type { BookDTO } from '../../hooks/types/book.type';
import type { PostDTO, PostCommentDTO } from '../../hooks/types/post.type';

import { userMock1, userMock2, userMock3, userMock4, userMock5 } from './user.mocks';

import { bookMock1, bookMock2, bookMock3 } from './book.mocks';

// Comments helpers
const comment1: PostCommentDTO = {
  id: 'pc1',
  author: userMock2,
  text: 'Amei essa perspectiva do livro!',
  createdAt: new Date('2025-06-25T12:00:00Z'),
  likes: 4,
};

const comment2: PostCommentDTO = {
  id: 'pc2',
  author: userMock3,
  text: 'Concordo – esse trecho foi emocionante.',
  createdAt: new Date('2025-06-25T13:15:00Z'),
  likes: 6,
};

const comment3: PostCommentDTO = {
  id: 'pc3',
  author: userMock4,
  text: 'Ainda não cheguei a essa parte, mas estou curioso!',
  createdAt: new Date('2025-06-26T09:30:00Z'),
  likes: 2,
};

const comment4: PostCommentDTO = {
  id: 'pc4',
  author: userMock1,
  text: 'Boa reflexão, gostei da profundidade.',
  createdAt: new Date('2025-06-27T11:45:00Z'),
  likes: 5,
};

const comment5: PostCommentDTO = {
  id: 'pc5',
  author: userMock5,
  text: 'Interessante o quanto o ritmo muda no meio.',
  createdAt: new Date('2025-06-28T08:20:00Z'),
  likes: 3,
};

// Five posts
export const postsMock: PostDTO[] = [
  {
    postID: 'p1',
    content: 'Iniciei do zero e já estou no meio! Estou adorando essa narrativa tão densa.',
    progress: 50,
    currentPage: 360,
    totalPages: 720,
    rating: 4.5,
    createdAt: new Date('2025-06-25T10:00:00Z'),
    book: bookMock1,
    author: userMock1,
    comments: [comment1, comment2],
    likeUserList: [userMock2, userMock3, userMock5],
  },
  {
    postID: 'p2',
    content: 'Primeiras 100 páginas concluídas. A leitura está fluida, mas o ritmo pé floreado.',
    progress: 25,
    currentPage: 120,
    totalPages: 480,
    rating: 3.8,
    createdAt: new Date('2025-06-26T08:15:00Z'),
    book: bookMock2,
    author: userMock2,
    comments: [comment3],
    likeUserList: [userMock1, userMock4],
  },
  {
    postID: 'p3',
    content: 'Finalize lendo em uma sentada — que final arrebatador!',
    progress: 100,
    currentPage: 720,
    totalPages: 720,
    rating: 5,
    createdAt: new Date('2025-06-27T17:45:00Z'),
    book: bookMock1,
    author: userMock3,
    comments: [comment4],
    likeUserList: [userMock1, userMock2, userMock4, userMock5],
  },
  {
    postID: 'p4',
    content: 'Leitura pausada. Já na metade. Algumas cenas emocionantes, outras um pouco chatas.',
    progress: 50,
    currentPage: 240,
    totalPages: 480,
    createdAt: new Date('2025-06-28T09:30:00Z'),
    book: bookMock2,
    author: userMock4,
    comments: [comment5],
    likeUserList: [userMock3],
  },
  {
    postID: 'p5',
    content:
      'Spoiler: o livro trouxe reflexões que mudaram minha visão sobre responsabilidade e graça.',
    progress: 80,
    currentPage: 576,
    totalPages: 720,
    rating: 4.8,
    createdAt: new Date('2025-06-29T14:10:00Z'),
    updatedAt: new Date('2025-06-30T08:00:00Z'),
    book: bookMock3,
    author: userMock5,
    comments: [],
    likeUserList: [userMock1, userMock2, userMock3, userMock4],
  },
];
