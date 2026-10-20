'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { GradeLevel } from '@/types';

const CLASSES: (GradeLevel | 'Toutes')[] = ['Toutes', 'SIL', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];

export function StudentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // États locaux pour les inputs (pour éviter de spammer le serveur à chaque touche)
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const gradeLevel = searchParams.get('gradeLevel') || 'all';
  const status = searchParams.get('status') || 'all';

  const updateUrl = useCallback((newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // On remet la page à 1 à chaque changement de filtre
    params.set('page', '1');

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`/eleves?${params.toString()}`);
  }, [router, searchParams]);

  // Debounce pour la recherche (attend 300ms après la dernière touche)
  useEffect(() => {
    if (search === (searchParams.get('search') || '')) return;

    const timer = setTimeout(() => {
      updateUrl({ search });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, searchParams, updateUrl]);

  return (
    <div className="space-y-4">
      {/* Barre d'onglets (Classes) */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          {CLASSES.map((c) => {
            const isActive = gradeLevel === c || (c === 'Toutes' && gradeLevel === 'all');
            return (
              <button
                key={c}
                onClick={() => updateUrl({ gradeLevel: c === 'Toutes' ? 'all' : c })}
                className={`
                  whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                  ${isActive ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {c === 'Toutes' ? 'Toutes les classes' : c}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Recherche et Statut */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={`Rechercher dans ${gradeLevel === 'all' ? "toutes les classes" : gradeLevel}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-none focus:ring-0 focus:outline-none"
          />
        </div>

        <div className="relative flex-shrink-0">
          <select
            value={status}
            onChange={(e) => updateUrl({ status: e.target.value })}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="Nouveau">Nouveaux</option>
            <option value="Passant">Passants</option>
            <option value="Redoublant">Redoublants</option>
            <option value="Transféré">Transférés</option>
            <option value="Candidat Examen">Candidats Examens</option>
          </select>
          <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
        </div>
      </div>
    </div>
  );
}