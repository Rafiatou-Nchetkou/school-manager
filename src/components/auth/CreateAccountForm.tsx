'use client';

import { useActionState } from 'react';
import { createAccountAction, type CreateAccountState } from '@/app/comptes/actions';

type TeacherOption = { id: string; nom: string; prenom: string };

export function CreateAccountForm({ teachers }: { teachers: TeacherOption[] }) {
  const [state, action, pending] = useActionState<CreateAccountState, FormData>(createAccountAction, undefined);

  return (
    <form action={action} className="max-w-xl space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-gray-700">Nom affiché</label>
        <input id="displayName" name="displayName" required minLength={2} maxLength={120}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Adresse courriel</label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={254}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100" />
      </div>
      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">Rôle</label>
        <select id="role" name="role" defaultValue="teacher" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5">
          <option value="teacher">Enseignant</option>
          <option value="director">Directrice</option>
        </select>
      </div>
      <div>
        <label htmlFor="teacherId" className="mb-1 block text-sm font-medium text-gray-700">Profil enseignant (pour un compte Enseignant)</label>
        <select id="teacherId" name="teacherId" defaultValue="" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5">
          <option value="">Aucun (compte Directrice)</option>
          {teachers.map(teacher => <option key={teacher.id} value={teacher.id}>{teacher.nom} {teacher.prenom}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Mot de passe temporaire (12 caractères minimum)</label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={256}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100" />
      </div>
      {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      {state?.success && <p role="status" className="text-sm text-emerald-700">{state.success}</p>}
      <button disabled={pending} type="submit" className="rounded-lg bg-primary-600 px-4 py-2.5 font-semibold text-white hover:bg-primary-900 disabled:opacity-60">
        {pending ? 'Création…' : 'Créer le compte'}
      </button>
    </form>
  );
}
