// src/hooks/useSignIn.ts
import { useState } from 'react';
import { AuthService } from '@services/AuthService';
import type { SignInDTO } from '@dto/auth.dto';

export default function useSignIn(onSuccess?: (url?: string) => void) {
  const [credentials, setCredentials] = useState<SignInDTO>({ username: '', password: '' });
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  function setField<K extends keyof SignInDTO>(field: K, value: SignInDTO[K]) {
    setCredentials(prev => ({ ...prev, [field]: value }));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.signIn(credentials);
      if (!res.ok) throw new Error(res.error || 'Login failed');
      onSuccess?.(res.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { credentials, setField, loading, error, submit };
}
