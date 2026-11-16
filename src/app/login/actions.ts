'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export type LoginState = { error?: string } | undefined;

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const login = formData.get('login');
  const password = formData.get('password');
  if (typeof login !== 'string' || typeof password !== 'string' || !login.trim() || !password) {
    return { error: 'Saisissez votre e-mail ou votre identifiant et votre mot de passe.' };
  }

  try {
    await signIn('credentials', { login: login.trim(), password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Identifiants invalides ou compte désactivé.' };
    throw error;
  }
  return undefined;
}
