// File: src/dto/user.dto.ts
export type UserDTO = {
    username:               string;
    name:                   string;
    avatarUrl:              string;
    bio?:                   string;

    followerCount?:         number;
    followingCount?:        number;
    followerUsernames?:     string[];
    followingUsernames?:    string[];
};