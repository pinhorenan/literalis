import { PostDTO } from '../core/post.model';

export interface FeedItemDTO extends PostDTO {
  //
}

export interface FeedDTO {
  items: FeedItemDTO[];
  nextCursor?: string;
}
