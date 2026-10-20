'use client';

import { Home, Users, Wallet, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center p-3">
        <Link href="/" aria-current={isActive('/') ? 'page' : undefined} className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Home size={24} /> <span className="text-[10px] font-medium">Accueil</span>
        </Link>
        <Link href="/eleves" aria-current={isActive('/eleves') ? 'page' : undefined} className={`flex flex-col items-center gap-1 ${isActive('/eleves') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Users size={24} /> <span className="text-[10px] font-medium">Élèves</span>
        </Link>
        <Link href="/finances" aria-current={isActive('/finances') ? 'page' : undefined} className={`flex flex-col items-center gap-1 ${isActive('/finances') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Wallet size={24} /> <span className="text-[10px] font-medium">Finances</span>
        </Link>
        <Link href="/classes" aria-current={isActive('/classes') ? 'page' : undefined} className={`flex flex-col items-center gap-1 ${isActive('/classes') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <BookOpen size={24} /> <span className="text-[10px] font-medium">Classes</span>
        </Link>
        <Link href="/enseignants" aria-current={isActive('/enseignants') ? 'page' : undefined} className={`flex flex-col items-center gap-1 ${isActive('/enseignants') ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'}`}>
          <Users size={24} /> <span className="text-[10px] font-medium">Enseignants</span>
        </Link>
      </div>
    </nav>
  );
}