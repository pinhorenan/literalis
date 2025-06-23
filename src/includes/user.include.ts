// src/includes/user.include.ts

// Seleciona apenas os campos públicos do usuário
export const publicUserSelect = {
    username:           true,
    name:               true,
    bio:                true,
    avatarUrl:          true,
    postCount:          true,
    bookCount:          true,
    followerCount:      true,
    followingCount:     true,
    followerUsernames:  true,
    followingUsernames: true,
} as const;

// Seleciona os campos públicos do usuário com contexto adicional
export const publicUserSelectWithContext = {
    ...publicUserSelect,
    isMe:               true,
    isFollower:         true,
    isFollowing:        true,
} as const;

// Seleciona os campos privados do usuário, incluindo os públicos (sem contexto)
export const privateUserSelect = {
    ...publicUserSelect,
    email:              true,
    createdAt:          true,
    updatedAt:          true,
} as const;

// Seleciona os campos mínimos do usuário, para exibição em listas ou cards
export const minimalUserSelect = {
    username:           true,
    name:               true,
    avatarUrl:          true,
} as const;

// Seleciona os campos necessários para criação de usuário
export const createUserSelect = {
    username:           true,
    email:              true,
    name:               true,
} as const;

// Seleciona os campos para atualização de usuário
export const updateUserSelect = {
    name:               true,
    bio:                true,
    email:              true,
    avatarUrl:          true,
} as const;
