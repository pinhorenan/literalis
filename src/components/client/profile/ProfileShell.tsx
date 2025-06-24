// src/components/client/profile/ProfileShell.tsx
'use client';

import { useSession } from 'next-auth/react';
import ProfileHeader from '@components/server/profile/ProfileHeader';
import PostsList from '@components/client/profile/PostsList';
import EditProfilePanel from '@components/client/profile/EditProfilePanel';

import useUserUpdate from '@hooks/user/useUserUpdate';

import type { UserDTO } from '@/src/models/user.model';
import type { PostDTO } from '@/src/models/post.model';

interface Props {
  initialUser: UserDTO;
  initialPosts: PostDTO[];
}

export default function ProfileShell({ initialUser, initialPosts }: Props) {
  const { data: session } = useSession();
  const meUsername = session?.user.username;
  const isSelf = meUsername === initialUser.username;

  const {
    user,
    isEditing,
    startEditing,
    cancelEditing,
    editName,
    editBio,
    editAvatar,
    handleNameChange,
    handleBioChange,
    handleAvatarUpload,
    saveProfile,
    saving,
  } = useUserUpdate(initialUser);

  return (
    <section className="relative flex-1 py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <ProfileHeader
        user={user}
        isSelf={isSelf}
        followerCount={user.followerCount}
        followingCount={user.followingCount}
        onEditClick={startEditing}
      />

      <PostsList posts={initialPosts} />

      <EditProfilePanel
        isOpen={isEditing}
        editName={editName}
        editBio={editBio}
        editAvatar={editAvatar}
        onNameChange={handleNameChange}
        onBioChange={handleBioChange}
        onAvatarChange={handleAvatarUpload}
        onSave={saveProfile}
        onCancel={cancelEditing}
        saving={saving}
      />
    </section>
  );
}
