// src/app/auth/onboarding/page.tsx
'use client';

import { completeOnboarding } from './actions';
import { useActionState } from 'react';
import { redirect } from 'next/navigation';

const initialState = { success: false, error: undefined as string | undefined };

export default function OnboardingPage() {
  const [state, formAction] = useActionState(completeOnboarding, initialState);

  if (state.success) redirect('/');

  return (
    <form action={formAction} className="mx-auto mt-20 flex w-80 flex-col space-y-4">
      <label className="font-medium">Escolha um @username</label>
      <input
        name="username"
        className="rounded border px-3 py-2"
        placeholder="ex.: fiódor_dostoievski"
        required
      />

      {state.error && <p className="text-warning text-sm">{state.error}</p>}

      <button className="text-primary bg-info rounded px-4 py-2">Salvar</button>
    </form>
  );
}
