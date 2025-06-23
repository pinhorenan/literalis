// src/hooks/user/useUpdateUserForm.ts
'use client';

import { useState } from 'react';
import type { UserDTO } from '@models/user.dto';
import { useUserUpdateMutation } from '@hooks/user/useUpdateUserMutation';

export function useUpdateUserForm(initialUser: UserDTO) {
  const [user, setUser] = useState<UserDTO>(initialUser);
  const [editName, setEditName] = useState(initialUser.name);
  const [editBio, setEditBio] = useState(initialUser.bio);
  const [editAvatar, setEditAvatar] = useState(initialUser.avatarUrl);
  const [isEditing, setIsEditing] = useState(false);

  const { update, saving, error } = useUserUpdateMutation(user.username);

  function startEditing() {
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setEditName(user.name);
    setEditBio(user.bio);
    setEditAvatar(user.avatarUrl);
  }

  function handleNameChange(value: string) {
    setEditName(value);
  }

  function handleBioChange(value: string) {
    setEditBio(value);
  }

  function handleAvatarUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function saveProfile() {
    const updated = await update({
      name: editName,
      bio: editBio,
      avatarUrl: editAvatar,
    });
    if (updated) {
      setUser(updated);
      setIsEditing(false);
    }
  }

  return {
    user,
    isEditing,
    editName,
    editBio,
    editAvatar,
    saving,
    error,
    startEditing,
    cancelEditing,
    handleNameChange,
    handleBioChange,
    handleAvatarUpload,
    saveProfile,
  };
}
