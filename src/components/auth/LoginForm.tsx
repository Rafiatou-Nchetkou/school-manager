'use client';

import { useActionState } from 'react';
import { loginAction, type LoginState } from '@/app/login/actions';

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="login" className="mb-1 block text-sm font-medium text-gray-700">Adresse e-mail ou identifiant</label>
        <input id="login" name="login" type="text" autoComplete="username" required maxLength={254}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Mot de passe</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100" />
      </div>
      {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} type="submit" className="w-full rounded-lg bg-primary-600 px-4 py-2.5 font-semibold text-white hover:bg-primary-900 disabled:opacity-60">
        {pending ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}
