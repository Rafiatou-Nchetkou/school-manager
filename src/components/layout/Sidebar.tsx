'use client';

import { Home, Users, Wallet, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
          EB
        </div>
        <div>
          <h1 className="font-bold text-gray-900 leading-tight">École Publique</h1>
          <p className="text-xs text-gray-500">de Bikondo</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/" aria-current={isActive('/') ? 'page' : undefined} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Home size={20} /> Tableau de bord
        </Link>
        <Link href="/eleves" aria-current={isActive('/eleves') ? 'page' : undefined} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/eleves') ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Users size={20} /> Élèves
        </Link>
        <Link href="/finances" aria-current={isActive('/finances') ? 'page' : undefined} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/finances') ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Wallet size={20} /> Finances
        </Link>
        <Link href="/classes" aria-current={isActive('/classes') ? 'page' : undefined} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/classes') ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
          <BookOpen size={20} /> Classes
        </Link>
        <Link href="/enseignants" aria-current={isActive('/enseignants') ? 'page' : undefined} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/enseignants') ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Users size={20} /> Enseignants
        </Link>
      </nav>
    </aside>
  );
}