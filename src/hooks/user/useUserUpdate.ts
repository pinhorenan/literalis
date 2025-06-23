// src/hooks/user/useUpdateUser.ts
'use client';

import { useState } from 'react';
import { UserServiceClient } from '@services/client/user.client';
import type { UserDTO } from '@models/user.dto';

export default function useUpdateUser(initialUser: UserDTO) {
  const [user, setUser] = useState<UserDTO>(initialUser);
  const [editName, setEditName] = useState(initialUser.name);
  const [editBio, setEditBio] = useState(initialUser.bio);
  const [editAvatar, setEditAvatar] = useState(initialUser.avatarUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
    setSaving(true);
    setError(null);
    try {
      const updated = await UserServiceClient.update(user.username, {
        name: editName,
        bio: editBio,
        avatarUrl: editAvatar,
      });
      if (updated) {
        setUser(updated);
        setIsEditing(false);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setSaving(false);
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
