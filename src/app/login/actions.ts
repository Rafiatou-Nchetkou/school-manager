'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export type LoginState = { error?: string } | undefined;

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email');
  const password = formData.get('password');
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return { error: 'Saisissez votre adresse courriel et votre mot de passe.' };
  }

  try {
    await signIn('credentials', { email: email.trim(), password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) return { error: 'Identifiants invalides ou compte désactivé.' };
    throw error;
  }
  return undefined;
}
