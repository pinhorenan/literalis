// File: src/components/client/profile/ProfileShell.tsx
'use client';
import { useSession } from 'next-auth/react';
import ProfileHeader      from '@components/server/profile/ProfileHeader';
import PostsList          from '@components/client/profile/PostsList';
import EditProfilePanel   from '@components/client/profile/EditProfilePanel';

import useProfileEditor   from '@hooks/useProfileEditor';
import useFollowStatus    from '@hooks/useFollowStatus';

import type { UserDTO }   from '@models/user.dto';
import type { PostDTO }   from '@models/post.dto';

interface Props {
  initialUser: UserDTO;
  initialPosts: PostDTO[];
}

export default function ProfileShell({ initialUser, initialPosts }: Props) {
  const { data: session } = useSession();
  const meUsername = session?.user.username;

  const {
    user,
    isSelf,
    isEditing,
    editName,
    editBio,
    editAvatar,
    startEditing,
    cancelEditing,
    handleNameChange,
    handleBioChange,
    handleAvatarUpload,
    saveProfile,
    saving,
  } = useProfileEditor(initialUser, meUsername);

  const {
    followerCount,
    followingCount,
  } = useFollowStatus(user.username, initialUser.followerCount, initialUser.followingCount);

  return (
    <section className="relative flex-1 py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <ProfileHeader
        user={user}
        isSelf={isSelf}
        followerCount={followerCount}
        followingCount={followingCount}
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
