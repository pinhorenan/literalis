// src/hooks/useProfileEditor.ts
import { useState, useCallback } from 'react';
import { UploadService }  from '@services/UploadService';
import { ProfileService } from '@services/ProfileService';
import type { UserDTO } from '@models/user.dto';

export default function useProfileEditor(initialUser: UserDTO, me: string) {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const isSelf = user.username === me;

  const [editName,   setEditName]   = useState(user.name);
  const [editBio,    setEditBio]    = useState(user.bio ?? '');
  const [editAvatar, setEditAvatar] = useState(user.avatarUrl);

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => { setIsEditing(false); resetEdits(); };
  const resetEdits = () => { setEditName(user.name); setEditBio(user.bio ?? ''); setEditAvatar(user.avatarUrl); };

  const handleAvatarUpload = async (file: File) => {
    try {
      const { url } = await UploadService.uploadAvatar(file);
      setEditAvatar(url);
    } catch (err:any) {
      setError(err.message);
    }
  };

  const saveProfile = useCallback(async () => {
    setSaving(true); setError(null);
    try {
      const updated = await ProfileService.update(user.username, {
        name: editName,
        bio:  editBio,
        avatarUrl: editAvatar,
      });
      setUser(updated);
      setIsEditing(false);
    } catch (err:any) { setError(err.message); }
    finally { setSaving(false); }
  }, [user.username, editName, editBio, editAvatar]);

  return {
    user, isSelf,
    isEditing, editName, editBio, editAvatar,
    startEditing, cancelEditing,
    setEditName, setEditBio,
    handleAvatarUpload,
    saveProfile, saving, error,
  };
}
