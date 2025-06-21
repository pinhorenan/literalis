import type { UserDTO } from '@models/user.dto'
import { findUserRaw }  from '@repository/user'

type MinimalUserForDTO = {
  username: string
  name: string
  avatarUrl: string
  bio: string
  createdAt: Date
  updatedAt: Date
  _count: {
    posts: number
    bookshelf: number
    followers: number
    following: number
  }
  followers: { followerUsername: string }[]
  following: { followedUsername: string }[]
}

export function mapUserToDTO(user: MinimalUserForDTO, viewerUsername?: string | null ): UserDTO {
  const isMe        = viewerUsername === user.username
  const isFollowing = viewerUsername != null && user.followers.some(f => f.followerUsername === viewerUsername)
  const isFollower  = viewerUsername != null && user.following.some(f => f.followedUsername === viewerUsername)

  return {
    username:           user.username,
    name:               user.name,
    avatarUrl:          user.avatarUrl,
    bio:                user.bio,
    createdAt:          user.createdAt.toISOString(),
    updatedAt:          user.updatedAt.toISOString(),
    postCount:          user._count.posts,
    bookCount:          user._count.bookshelf,
    followerCount:      user._count.followers,
    followingCount:     user._count.following,
    followerUsernames:  user.followers.map(f => f.followerUsername),
    followingUsernames: user.following.map(f => f.followedUsername),
    isMe,
    isFollowing,
    isFollower,
  }
}

export async function findUserByUsername(params: {
  username: string
  viewerUsername?: string | null
}): Promise<UserDTO | null> {
  const { username, viewerUsername = null } = params
  const user = await findUserRaw({ username, viewerUsername })
  return user ? mapUserToDTO(user, viewerUsername) : null
}
