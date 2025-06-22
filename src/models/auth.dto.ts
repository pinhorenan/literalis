// File: src/models/auth.dto.ts
export interface SignUpDTO {
    username: string;
    name: string;
    email: string;
    password: string;
    avatarUrl?: string;
    bio?: string;
};

export interface SignInDTO {
    username: string;
    password: string;
};