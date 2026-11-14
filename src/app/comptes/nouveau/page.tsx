import { CreateAccountForm } from '@/components/auth/CreateAccountForm';
import { listTeachers } from '@/lib/schoolDirectory';

export default async function NewAccountPage() {
  const { data } = await listTeachers({ status: 'all' });
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Créer un compte</h1>
        <p className="mt-1 text-sm text-gray-500">Seule la Directrice peut créer des comptes pour l’établissement.</p>
      </header>
      <CreateAccountForm teachers={data.map(teacher => ({ id: teacher.id, nom: teacher.nom, prenom: teacher.prenom }))} />
    </div>
  );
}
