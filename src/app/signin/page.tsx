// src/app/signin/page.tsx

import SignInForm from '@components/client/auth/SignInForm';

export default function SignIn() {
  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-lg bg-[var(--surface-alt)] shadow-lg">
      <h1 className="text-3x1 font-bold mb-6 text-center">Entrar</h1>
      <SignInForm />
    </div>
  );
}