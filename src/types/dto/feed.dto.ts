//File: src/types/dto/feed.dto.ts
import type { PostDTO } from '@dto/post.dto';

export type FeedResponse = {
    posts: PostDTO[];
}