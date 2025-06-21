// File: src/components/auth/SignUpForm.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/client/ui/Buttons';
import { AuthService } from '@services/AuthService';
import Link from 'next/link';

interface SignUpFormProps {
  redirectTo?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export default function SignUpForm({
  redirectTo = '/signin',
  compact = false,
  onSuccess,
}: SignUpFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '', name: '', email: '', password: '', avatarUrl: '', bio: '',
  });
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await AuthService.signUp(formData);
      onSuccess?.();
      router.push(redirectTo);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const setField = <K extends keyof typeof formData>(key: K, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm"
        >
          {error}
        </div>
      )}

      {(['username','name','email','password','avatarUrl','bio'] as const).map(key => (
        key === 'bio' ? (
          <div key={key}>
            <label htmlFor={key} className="block mb-1 font-medium">
              Biografia (opcional)
            </label>
            <textarea
              id={key}
              name={key}
              rows={3}
              value={formData[key]}
              onChange={e => setField(key, e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        ) : (
          <div key={key}>
            <label htmlFor={key} className="block mb-1 font-medium">
              {key.charAt(0).toUpperCase()+key.slice(1)}
              {['username','name','password'].includes(key) && ' *'}
            </label>
            <input
              id={key}
              name={key}
              type={key === 'password' ? 'password' : 'text'}
              value={formData[key]}
              onChange={e => setField(key, e.target.value)}
              required={['username','name','password'].includes(key)}
              className="w-full border p-2 rounded"
            />
          </div>
        )
      ))}

      <Button type="submit" variant="default" size="md" className="w-full" disabled={loading}>
        {loading ? 'Cadastrando…' : 'Cadastrar'}
      </Button>

      {!compact && (
        <p className="text-center text-sm mt-4">
          Já tem conta?{' '}
          <Link href="/signin" className="underline text-[var(--text-link)]">
            Entrar
          </Link>
        </p>
      )}
    </form>
);
}
