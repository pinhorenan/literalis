// src/models/user.dto.ts
export type UserDTO = {
    username:               string;
    name:                   string;
    avatarUrl:              string;
    bio:                    string;
    createdAt:              string;
    updatedAt:              string;
    postCount:              number;
    bookCount:              number;
    isMe:                   boolean;
    isFollower:             boolean;
    isFollowing:            boolean;
    followerCount:          number;
    followingCount:         number;
    followingUsernames:     string[];
    followerUsernames:      string[];
};

export type PublicUserDTO = {
    username: string;
    name: string;
    avatarUrl: string;
    bio?: string;
}

export interface UpdateUserDTO {
    name: string;
    bio?: string;
    avatarUrl?: string;
}