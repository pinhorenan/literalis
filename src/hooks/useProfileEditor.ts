// src/hooks/useProfileEditor.ts
'use client';

import { useState } from 'react';
import type { UserDTO } from '@models/user.dto';
import { ProfileService } from '@services/server/profile.service';
import { toast } from 'react-hot-toast';

export default function useProfileEditor(initialUser: UserDTO, meUsername?: string) {
  const isSelf = initialUser.username === meUsername;

  const [user, setUser] = useState<UserDTO>(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState(initialUser.name);
  const [editBio, setEditBio] = useState(initialUser.bio);
  const [editAvatar, setEditAvatar] = useState(initialUser.avatarUrl);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setEditName(user.name);
    setEditBio(user.bio ?? '');
    setEditAvatar(user.avatarUrl);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  async function handleAvatarUpload(file: File) {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: form,
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Erro ao enviar imagem.');
      return;
    }

    setEditAvatar(data.url);
    toast.success('Imagem enviada com sucesso');
  }

  async function saveProfile() {
    setSaving(true);

    try {
      const updated = await ProfileService.updateProfile(user.username, {
        name: editName,
        bio: editBio,
        avatarUrl: editAvatar,
      });
      setUser({ ...user, ...updated, updatedAt: new Date().toISOString() });
      toast.success('Perfil atualizado');
      setIsEditing(false);
    } catch (err) {
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  }

  return {
    user,
    isSelf,
    isEditing,
    editName,
    editBio,
    editAvatar,
    startEditing,
    cancelEditing,
    handleNameChange: setEditName,
    handleBioChange: setEditBio,
    handleAvatarUpload,
    saveProfile,
    saving,
  };
}
