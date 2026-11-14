import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface p-4">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Gestion scolaire</h1>
        <p className="mb-6 mt-2 text-sm text-gray-500">Connectez-vous avec le compte de votre établissement.</p>
        <LoginForm />
      </section>
    </main>
  );
}
