// File: src/components/auth/SignInForm.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/client/ui/Buttons';
import useSignIn from '@hooks/useSignIn';
import Link from 'next/link';

interface LoginFormProps {
  redirectTo?: string;
  onSuccess?: (url?: string) => void;
  compact?: boolean;
}

export default function SignInForm({
  redirectTo = '/feed',
  onSuccess,
  compact = false,
}: LoginFormProps) {
  const router = useRouter();
  const {
    credentials,
    setField,
    error,
    loading,
    submit,
  } = useSignIn(url => {
    onSuccess?.(url);
    router.push(url || redirectTo);
  });
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  return (
    <form
      onSubmit={e => { e.preventDefault(); submit(); }}
      className="space-y-4"
      noValidate
    >
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
