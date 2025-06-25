// src/models/feed.model.ts
import { PostDTO } from './post.model';

export interface FeedItemDTO extends PostDTO {
  //
}

export interface FeedDTO {
  items: FeedItemDTO[];
  nextCursor?: string;
}
