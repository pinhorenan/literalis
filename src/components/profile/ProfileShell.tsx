// File: src/components/profile/ProfileShell.tsx
'use client'

import React, { useState, useEffect, FormEvent, useCallback } from 'react'
import { useSession }                         from 'next-auth/react'

import ProfileHeader                          from '@components/profile/ProfileHeader'
import EditProfilePanel                       from '@components/profile/EditProfilePanel'
import PostsList                              from '@components/profile/PostsList';
import type { ClientPost }                    from '@/src/types/posts'

interface ClientUser {
  username: string
  name: string
  email?: string
  avatarUrl: string
  bio?: string
  followerCount: number
  followingCount: number
}

interface Props {
  initialUser: ClientUser
  initialPosts: ClientPost[]
}

export default function ProfileShell({ initialUser, initialPosts }: Props) {
  const { data: session, status } = useSession()
  const loggedIn   = status === 'authenticated'
  const meUsername = session?.user.username

  // estados principais
  const [user, setUser]                   = useState(initialUser)
  const [followerCount, setFollowerCount] = useState(initialUser.followerCount)
  const [followingCount]                  = useState(initialUser.followingCount)
  const [isFollowing, setIsFollowing]     = useState(false)

  // carregar status de follow
  useEffect(() => {
    if (!loggedIn || meUsername === user.username) return
    fetch(`/api/users/${user.username}/follow`)
      .then(r => r.json())
      .then(j => setIsFollowing(Boolean(j.following)))
  }, [loggedIn, meUsername, user.username])

  const handleFollowToggle = useCallback(async () => {
    if (!loggedIn) return
    const method = isFollowing ? 'DELETE' : 'POST'
    const res = await fetch(`/api/users/${user.username}/follow`, { method })
    if (res.ok) {
      setIsFollowing(f => !f)
      setFollowerCount(c => c + (isFollowing ? -1 : +1))
    }
  }, [isFollowing, loggedIn, user.username])

  // estados de edição
  const [isEditing, setIsEditing]   = useState(false)
  const [editName, setEditName]     = useState(user.name)
  const [editBio, setEditBio]       = useState(user.bio || '')
  const [editAvatar, setEditAvatar] = useState(user.avatarUrl)

  // salvamento
  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    const body = { name: editName, bio: editBio, avatarUrl: editAvatar }
    const res = await fetch(`/api/users/${user.username}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      alert('Erro ao atualizar perfil')
      return
    }
    const updated: ClientUser = await res.json()
    setUser(updated)
    setFollowerCount(updated.followerCount)
    setIsEditing(false)
  }

  // avatar upload
  const handleAvatarChange = (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    fetch('/api/upload/avatar', { method: 'POST', body: form })
      .then(r => r.json())
      .then(j => setEditAvatar(j.url))
      .catch(() => console.error('Upload falhou'))
  }

  const handleCancel = () => {
    setEditName(user.name)
    setEditBio(user.bio || '')
    setEditAvatar(user.avatarUrl)
    setIsEditing(false)
  }

  return (
    <section className="relative flex-1 py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <ProfileHeader
        user={user}
        isSelf={loggedIn && meUsername === user.username}
        isFollowing={isFollowing}
        followerCount={followerCount}
        followingCount={followingCount}
        onFollowToggle={handleFollowToggle}
        onEditClick={() => setIsEditing(true)}
      />

      <PostsList posts={initialPosts} />

      <EditProfilePanel
        isOpen={isEditing}
        editName={editName}
        editBio={editBio}
        editAvatar={editAvatar}
        onNameChange={setEditName}
        onBioChange={setEditBio}
        onAvatarChange={handleAvatarChange}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </section>
  )
}
