// File: src/hooks/useSignUp.ts
import { useState } from 'react';
import { AuthService } from '@/src/lib/services/AuthService';
import type { SignUpDTO } from '@models/auth.dto';

export default function useSignUp(onSuccess: () => void) {
  const [formData, setFormData] = useState<SignUpDTO>({
    username: '',
    name: '',
    email: '',
    password: '',
    avatarUrl: '',
    bio: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function setField(field: keyof SignUpDTO, value: string) {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  }

  async function submit() {
    setError(null);
    setLoading(true);
    try {
      await AuthService.signUp(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { formData, setField, error, loading, submit };
}
