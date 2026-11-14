import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { auth } from '@/auth';
import { logoutAction } from '@/app/auth-actions';
import { connection } from 'next/server';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'École Publique de Bikondo - Gestion',
  description: 'Application de gestion scolaire',
};

// The root layout reads the request session and is allowed to block rendering.
export const instant = false;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();
  return (
    <html lang="fr">
      <body>
        {session?.user ? (
          <div className="flex min-h-screen">
            <Sidebar role={session.user.role} />
            <main className="flex-1 pb-20 md:pb-0">
              <div className="flex items-center justify-end gap-3 border-b border-gray-200 bg-white px-6 py-3 text-sm">
                <span className="text-gray-600">{session.user.name} · {session.user.role === 'director' ? 'Directrice' : 'Enseignant'}</span>
                {session.user.role === 'director' && <Link className="font-medium text-primary-600 hover:underline" href="/comptes/nouveau">Créer un compte</Link>}
                <form action={logoutAction}><button className="font-medium text-primary-600 hover:underline" type="submit">Déconnexion</button></form>
              </div>
              {children}
            </main>
            <BottomNav role={session.user.role} />
          </div>
        ) : children}
      </body>
    </html>
  );
}
