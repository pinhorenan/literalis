import { useState } from 'react';
import { updateUser } from '@clients/user.client';
import type { UserDTO } from '@models/user.model';

export default function useUserUpdate(initial: UserDTO) {
  const [user, setUser] = useState<UserDTO>(initial);
  const [editName, setEditName] = useState(initial.name);
  const [editBio, setEditBio] = useState(initial.bio);
  const [editAvatar, setEditAvatar] = useState(initial.avatarUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => {
    setIsEditing(false);
    setEditName(user.name);
    setEditBio(user.bio);
    setEditAvatar(user.avatarUrl);
  };

  const handleNameChange = (v: string) => setEditName(v);
  const handleBioChange = (v: string) => setEditBio(v);
  const handleAvatarUpload = (v: string) => setEditAvatar(v);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateUser(user.username, {
        name: editName,
        bio: editBio,
        avatarUrl: editAvatar,
      });
      setUser(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
}
