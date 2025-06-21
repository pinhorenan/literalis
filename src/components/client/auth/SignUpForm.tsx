// File: src/components/auth/SignUpForm.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/client/ui/Buttons';
import useSignUp from '@hooks/useSignUp';

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
  const {
    formData,
    setField,
    error,
    loading,
    submit,
  } = useSignUp(() => {
    onSuccess?.();
    router.push(redirectTo);
  });
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
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

      {(['username','name','email','password','avatarUrl','bio'] as const).map(key => (
        key === 'bio' ? (
          <div key={key}>
            <label htmlFor={key} className="block mb-1 font-medium">
              {key === 'bio' ? 'Biografia (opcional)' : key}
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
              {key.charAt(0).toUpperCase()+key.slice(1)}{['username','name','password'].includes(key) && ' *'}
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
          <a href="/auth/login" className="underline text-[var(--text-link)]">
            Entrar
          </a>
        </p>
      )}
    </form>
  );
}
