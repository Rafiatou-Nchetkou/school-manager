'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search } from 'lucide-react';

export function TeacherFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const status = searchParams.get('status') || 'all';

  const updateUrl = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value);
      else params.delete(key);
    });

    router.push(`/enseignants?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    if (search === (searchParams.get('search') || '')) return;

    const timer = setTimeout(() => updateUrl({ search }), 300);
    return () => clearTimeout(timer);
  }, [search, searchParams, updateUrl]);

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher un enseignant..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-none focus:ring-0 focus:outline-none"
        />
      </div>
      <div className="relative flex-shrink-0">
        <select
          value={status}
          onChange={(event) => updateUrl({ status: event.target.value })}
          className="appearance-none pl-3 pr-8 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer"
        >
          <option value="all">Tous les statuts</option>
          <option value="Fonctionnaire">Fonctionnaire</option>
          <option value="Contractuel">Contractuel</option>
        </select>
        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
      </div>
    </div>
  );
}
