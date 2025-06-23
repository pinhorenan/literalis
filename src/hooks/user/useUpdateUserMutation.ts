// src/hooks/user/useUpdateUserMutation.ts
'use client';

import { useState } from 'react';
import { UserClient } from '@services/client/user.client';
import type { UpdateUserDTO, UserDTO } from '@models/user.dto';

export function useUserUpdateMutation(username: string) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function update(data: UpdateUserDTO): Promise<UserDTO | null> {
    setSaving(true);
    setError(null);
    try {
      return await UserClient.update(username, data);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  return {
    update,
    saving,
    error,
  };
}
