// File: src/components/auth/SignInForm.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter }  from 'next/navigation';
import { signIn }     from 'next-auth/react';
import Link           from 'next/link';
import { Button }     from '@components/client/ui/Buttons';

interface LoginFormProps {
  redirectTo?: string;
  compact?: boolean;
}

export default function SignInForm({
  redirectTo = '/feed',
  compact = false,
}: LoginFormProps) {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      username: credentials.username,
      password: credentials.password,
    });

    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push(res?.url ?? redirectTo);
    }
  };

  const setField = (key: 'username' | 'password', value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
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

      {(['username','password'] as const).map(key => (
        <div key={key}>
          <label htmlFor={key} className="block mb-1 font-medium">
            {key.charAt(0).toUpperCase()+key.slice(1)} *
          </label>
          <input
            id={key}
            name={key}
            type={key === 'password' ? 'password' : 'text'}
            autoComplete={key}
            value={credentials[key]}
            onChange={e => setField(key, e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
      ))}

      <Button type="submit" variant="default" size="md" className="w-full" disabled={loading}>
        {loading ? 'Entrando…' : 'Entrar'}
      </Button>

      {!compact && (
        <div className="text-center text-sm">
          Não tem conta?{' '}
          <Link href="/signup" className="underline text-[var(--text-primary)]">
            Cadastre-se
          </Link>
        </div>
      )}
    </form>
  );
}
