'use client'; // ✅ precisa ser client

import { useFormState } from 'react-dom';
import { completeOnboarding } from './actions';
import { redirect } from 'next/navigation';

const initialState = { success: false, error: undefined as string | undefined };

export default function OnboardingPage() {
  const [state, formAction] = useFormState(completeOnboarding, initialState);

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

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button className="rounded bg-blue-600 px-4 py-2 text-white">Salvar</button>
    </form>
  );
}
